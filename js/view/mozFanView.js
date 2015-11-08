define(['jquery',
    'backbone',
    'underscore',
    'cytoscape',
    'model/twitterDataFetchModel',
    'text!../../content/templates/graphView.html',
    'text!../../content/styles/style.css'
],
    function($,Backbone,_,cytoscape,twitterDataFetchModel,graphViewTemplate,style)
    {

        var followersList, cy;
        var start, end;
        var $body = $('body');

        function initCytoScape() {
            var loading = $('#loading');

            loading.addClass('loaded');

            cy = cytoscape({
                container:$('#cy'),
                layout:{ name: 'preset'},
                style: style,
                elements: followersList,
                motionBlur: true,
                selectionType: 'single',
                boxSelectionEnabled: false
            });

            mendData();
            bindRouters();
        }

        function mendData() {
            cy.startBatch();

            // put nodes in bins based on name
            var nodes = cy.nodes();
            var bin = {};
            var metanames = [];
            for( var i = 0; i < nodes.length; i++ ){
                var node = nodes[i];
                var name = node.data('name');
                var nbin = bin[ name ] = bin[ name ] || [];

                nbin.push( node );

                if( nbin.length === 2 ){
                    metanames.push( name );
                }
            }

            // connect all nodes together with walking edges
            for( var i = 0; i < metanames.length; i++ ){
                var name = metanames[i];
                var nbin = bin[ name ];

                for( var j = 0; j < nbin.length; j++ ){
                    for( var k = j + 1; k < nbin.length; k++ ){
                        var nj = nbin[j];
                        var nk = nbin[k];

                        cy.add({
                            group: 'edges',
                            data: {
                                source: nj.id(),
                                target: nk.id(),
                                is_walking: true
                            }
                        });
                    }
                }

            }

            cy.endBatch();
        }

        function selectStart() {
            clear();

            $body.addClass('has-start');

            start = node;

            start.addClass('start');
        }

        function selectEnd( node ) {
            $body.addClass('has-end calc');

            end = node;

            cy.startBatch();

            end.addClass('end');

            setTimeout(function(){
                var aStar = cy.elements().aStar({
                    root: start,
                    goal: end,
                    weight: function( e ){
                        if( e.data('is_walking') ){
                            return 0.25; // assume very little time to walk inside stn
                        }

                        return e.data('is_bullet') ? 1 : 3; // assume bullet is ~3x faster
                    }
                });

                if( !aStar.found ){
                    $body.removeClass('calc');
                    clear();

                    cy.endBatch();
                    return;
                }

                cy.elements().not( aStar.path ).addClass('not-path');
                aStar.path.addClass('path');

                cy.endBatch();

                $body.removeClass('calc');
            }, 300);
        }

        function clear() {
            $body.removeClass('has-start has-end');
            cy.elements().removeClass('path not-path start end');
        }

        function bindRouters() {

            var $clear = $('#clear');

            cy.nodes().qtip({
                content: {
                    text: function(){
                        var $ctr = $('<div class="select-buttons"></div>');
                        var $start = $('<button id="start">START</button>');
                        var $end = $('<button id="end">END</button>');

                        $start.on('click', function(){
                            var n = cy.$('node:selected');

                            selectStart( n );

                            n.qtip('api').hide();
                        });

                        $end.on('click', function(){
                            var n = cy.$('node:selected');

                            selectEnd( n );

                            n.qtip('api').hide();
                        });

                        $ctr.append( $start ).append( $end );

                        return $ctr;
                    }
                },
                show: {
                    solo: true
                },
                position: {
                    my: 'top center',
                    at: 'bottom center',
                    adjust: {
                        method: 'flip'
                    }
                },
                style: {
                    classes: 'qtip-bootstrap',
                    tip: {
                        width: 16,
                        height: 8
                    }
                }
            });

            $clear.on('click', clear);
        }

        return Backbone.View.extend({

            initialize: function(options){
                _.bindAll(this);

                this.model = new twitterDataFetchModel({
                    dataFetchSuccessCallback: this.setSuccessCallBackForFetch,
                    dataFetchFailureCallback: this.setFailureCallBackForFetch,
                    requestUrl:"http://localhost:3000/followers.json?username=mozilla"
                });

            },

            renderNow: function(){
                $("graph-view-container").html(graphViewTemplate);
                _.defer(initCytoScape());
            },

            setSuccessCallBackForFetch: function(data, textStatus, jqXHR ) {
                followersList = data.data;
                this.renderNow();
            },

            setFailureCallBackForFetch: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus +" "+ errorThrown);
            },


            getFollowersList: function(){
                this.model.getFollowersMetaData();
            }


        });
    }
);
