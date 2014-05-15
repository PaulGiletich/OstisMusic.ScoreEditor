define(function (require) {

    window.EditorCtrl = require('controller/EditorCtrl');
    window.FileCtrl = require('controller/FileCtrl');
    window.TrackViewCtrl = require('controller/TrackViewCtrl');
    window.KeyboardCtrl = require('controller/KeyboardCtrl');
    window.FretboardCtrl = require('controller/FretboardCtrl');

    var app = angular.module("app", ['ui.bootstrap']);
    require(['domReady'], function(document){
        angular.bootstrap(document, ['app']);
    });

    return app;
});