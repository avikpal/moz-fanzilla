require.config(
    {
        baseUrl: 'js',

        paths: {
            jquery : 'lib/jquery-2.1.0',
            underscore: 'lib/lodash.underscore',
            backbone: 'lib/backbone-min',
            handlebars: 'lib/handlebars-v3.0.3.js',
            text:'lib/text.js'
        },

        shim: {
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: ["jquery", "underscore"],
                exports: "backbone"
            },
            handlebars: {
                exports: "handlebars"
            }
        }
    }
);