require.config({
    baseUrl: "./scripts",
    paths: {
        'domReady': '../bower_components/requirejs-domready/domReady',
        'amd-loader': '../bower_components/amd-loader/amd-loader',
        'es6': '../bower_components/es6/es6',
        'traceur-compiler': '../bower_components/es6/traceur-compiler',
        'keyboard-js': '../bower_components/KeyboardJS/keyboard'
    },
    deps: ['app']
});