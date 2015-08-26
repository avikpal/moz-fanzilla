define(['jquery',
        'backbone',
        'underscore'
    ],
    function($,Backbone,_){

        var url;

        return Backbone.Model.extend({

            initialize: function (options) {
                _.bindAll(this);
                if(null != options) {
                    this._dataFetchSuccessCallback = options.dataFetchSuccessCallback;
                    this._dataFetchFailureCallback = options.dataFetchFailureCallback;
                    url = options.requestUrl;
                }
            },

            setRequestUrl: function(options) {
                if(null != options.url) {
                    url = options.url;
                }
            },

            getFollowersMetaData: function(options) {
                if(null != options) {
                    url = options.url;
                }
                $.ajax(url,
                    {
                        success:this._dataFetchSuccessCallback,
                        error:this._dataFetchFailureCallback
                    }
                )
            }

        });
    }
);