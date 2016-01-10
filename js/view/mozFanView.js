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
