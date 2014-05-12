require.config({
    baseUrl: "./js",
    paths: {
        'domReady': '../lib/requirejs-domready/domReady',
        'amd-loader': '../lib/amd-loader/amd-loader',
        'es6': '../lib/es6/es6',
        'traceur-compiler': '../lib/es6/traceur-compiler',
        'keyboard-js': '../lib/keyboard'
    },
    shim: {
        'keyboard-js': {
            exports: 'KeyboardJS'
        }
    },
    deps: ['app']
});