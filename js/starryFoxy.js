"use strict";

define(['view/mozFanView'],
    function(fanView){

        var initialize = function() {
            this.fanView = new fanView();
            this.fanView.initialize();
            this.fanView.getFollowersList();
        };

        return {
            initialize: initialize
        };

    });
