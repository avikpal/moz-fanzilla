define(['jquery',
    'backbone',
    'underscore',
    'model/twitterDataFetchModel',
    'handlebars'//,
    //'text!../../content/templates/graphView.html'
],
    function($,Backbone,_,twitterDataFetchModel,
             Handlebars)//,graphViewTemplate)
    {

        var followersList;

        return Backbone.View.extend({

            initialize: function(options){
                _.bindAll(this);
                //this.viewTemplate = Handlebars.compile(mapViewTemplate.html());
                //this.viewTemplate = _.template(template);
                this.model = new twitterDataFetchModel({
                    dataFetchSuccessCallback: this.setSuccessCallBackForFetch,
                    dataFetchFailureCallback: this.setFailureCallBackForFetch,
                    requestUrl:"http://localhost:3000/followers.json?username=avikpalme"
                });

            },

            setSuccessCallBackForFetch: function(data, textStatus, jqXHR ) {
                followersList = data;
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
