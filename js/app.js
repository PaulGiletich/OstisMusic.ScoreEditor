define(function (require) {

    window.EditorCtrl = require('controller/EditorCtrl');
    window.FileCtrl = require('controller/FileCtrl');
    window.TrackViewCtrl = require('controller/TrackViewCtrl');

    var app = angular.module("app", ['ui.select2']);
    require(['domReady'], function(document){
        angular.bootstrap(document, ['app']);
    });

    return app;
});