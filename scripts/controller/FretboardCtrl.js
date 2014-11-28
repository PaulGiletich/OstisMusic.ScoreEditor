define(function(require){
    var Player = require('es6!scripts/player');
    var Util = require('scripts/util');
    var KeyboardJS = require('keyboard-js');

    var defaultTuning = {
        1: 'E4',
        2: 'B3',
        3: 'G3',
        4: 'D3',
        5: 'A2',
        6: 'E2'
    };

    var FretboardCtrl = function ($scope) {
        $scope.range = _.range;
        $scope.tuning = defaultTuning;

        $scope.playString = function (string, fret) {
            console.log(string, fret);
            var noteValue = MIDI.keyToNote[$scope.tuning[string]] + fret;
            Player.startTone(noteValue);
        }
    };

    return FretboardCtrl;
});