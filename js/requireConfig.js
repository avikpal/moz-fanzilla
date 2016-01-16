require.config(
    {
        baseUrl: 'js',

        paths: {
            jquery : 'lib/jquery-2.1.0',
            underscore: 'lib/lodash.underscore',
            backbone: 'lib/backbone-min',
            async:'lib/async',
            handlebars: 'lib/handlebars-v3.0.3',
            text:'lib/text',
            cytoscape:'lib/cytoscape'
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