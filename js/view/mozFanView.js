define(['jquery',
    'backbone',
    'underscore',
    'cytoscape',
    'model/twitterDataFetchModel',
    'text!../../content/templates/graphView.html',
],
    function($, Backbone, _, cytoscape, twitterDataFetchModel, graphViewTemplate)
    {

        var followersList, cy;
        var start, end;
        var $body = $('body');

        function initCytoScape() {
            //TODO add and implement proper graph drawing algorithm
            //first set up the elements and edges array
            var nodes = [], edges = [];

            nodes.push({data: {"id": "followed","name": "mozilla"}});
            _.forEach(followersList, function(node) {
                nodes.push({data: {"id":node.screen_name ,"name": node.screen_name}});
                edges.push({data: {"source": node.screen_name, target: 'followed'}})
            });


            var cy = cytoscape({
                container: $('#cy'),

                boxSelectionEnabled: false,
                autounselectify: true,

                style: cytoscape.stylesheet()
                    .selector('node')
                    .css({
                        'content': 'data(name)',
                        'text-valign': 'center',
                        'color': 'white',
                        'text-outline-width': 2,
                        'text-outline-color': '#888'
                    })
                    .selector(':selected')
                    .css({
                        'background-color': 'black',
                        'line-color': 'black',
                        'target-arrow-color': 'black',
                        'source-arrow-color': 'black',
                        'text-outline-color': 'black'
                    }),

                elements: {
                    nodes: nodes,
                    edges: edges
                },

                layout: {
                    name: 'grid',
                    padding: 10
                }
            });
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
                $("#graph-view-container").append(graphViewTemplate);
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
