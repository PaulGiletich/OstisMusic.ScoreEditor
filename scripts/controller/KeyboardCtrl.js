define(function(require){
    var Player = require('es6!scripts/player');
    var Util = require('scripts/util');
    var KeyboardJS = require('keyboard-js');

    var KeyboardCtrl = function($scope, $modal){

        //todo - this is temporary solution of problem that will be revolved when i move rendering of this to angular
        window.keyboardCtrl = this;

        $scope.notesCount = 32;
        $scope.startOctave = 4;
        $scope.sustain = false;

        KeyboardJS.on('space', function(){
            $scope.$apply(function(){
                $scope.sustain = !$scope.sustain;
            })
        });

        this.update = function () {
            $('.keyboard').empty();
            var octaveShift = $scope.activeTrack.options.octaveShift;
            for(var i = 0; i < $scope.notesCount; i++){
                var note = Util.keyboardNotes[i % 12];
                var octave = $scope.startOctave + octaveShift + Math.floor(i/12);
                var $key = note.indexOf('b') == -1 ? createKey(note, octave) : createBlackKey(note, octave);
                bindKeyEvents($key.find('.key'), i, note, octave);
                $('.keyboard').append($key);
            }
            $('.keyboard').height($('key-white-wrapper').height());
        };

        $scope.$watch('activeTrack.options.octaveShift', this.update);

        function bindKeyEvents($key, keyIndex, note, octave){
            var keyKey = Util.keyboardKeys[keyIndex];
            $key.append($('<div class="key-key">').text(keyKey.toUpperCase()));
            KeyboardJS.clear(keyKey);
            KeyboardJS.on(keyKey, playKey, stopKey);

            $key.mousedown(playKey);
            $key.mouseup(stopKey);

            var fired = false;

            //easter-egg
            var timesPressed = 0;
            setInterval(function(){
                timesPressed = 0;
            }, 10000);
            function playKey(){
                if(!fired) {
                    $key.addClass('key-pressed');
                    Player.startTone(note, octave);
                    fired = true;

                    //easter-egg
                    timesPressed++;
                    if(timesPressed > 30){
                        timesPressed = 0;
                        var modalInstance = $modal.open({
                            template: '<div style="text-align: center"><img src="images/emma.jpg"></div>',
                            size: 'sm'
                        });
                    }
                }
            }

            function stopKey(){
                fired = false;
                $key.removeClass('key-pressed');
                if($scope.sustain) return;
                Player.endTone(note, octave);
            }
        }

        //TODO move to handlebars or dust.js
        function createKey(note, octave){
            return $('<div class="key-white-wrapper">')
                .append($('<div class="key">')
                    .append($('<div class="key-text">')
                        .text(note + octave)));
        }

        function createBlackKey(note, octave){
            return $('<div class="key-black-wrapper">')
                .append($('<div class="key key-black">')
                    .append($('<div class="key-text">')
                        .text(note + octave)));
        }
    };

    return KeyboardCtrl;
});