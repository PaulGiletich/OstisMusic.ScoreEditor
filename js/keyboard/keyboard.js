define(['util', 'player'], function(Util, Player){
    "use strict";
    var self = this;
    var $keyboard = $('.keyboard');
    var sustain = false;

    var Keyboard = {
        init: function(){
            var notesCount = 32;
            var startOctave = 4;

            for(var i = 0; i < notesCount; i++){
                var note = Util.keyboardNotes[i % 12];
                var octave = startOctave + Math.floor(i/12);
                var $key = note.indexOf('b') == -1 ? createKey(note, octave) : createBlackKey(note, octave);
                bindKeyEvents($key.find('.key'), i, note, octave);
                $keyboard.append($key);
            }
            bindEvents();

            $('.key').addClass('key-disabled');
            $(document).on('playerReady', function(){
                $('.key').removeClass('key-disabled');
            });
            $('.keyboard').height($('key-white-wrapper').height());
        }
    };

    function bindKeyEvents($key, keyIndex, note, octave){
        $key.mousedown(function(e){
            $(e.currentTarget).addClass('key-pressed');
            Player.startTone(note, octave);
        });
        $key.mouseup(function(e){
            $('.key').removeClass('key-pressed');
            if(sustain) return;
            Player.endTone(note, octave);
        });
        var keyKey = Util.keyboardKeys[keyIndex];
        $key.append($('<div class="key-key">').text(keyKey.toUpperCase()));

        var fired = false;
        KeyboardJS.on(keyKey, function(){
            if(!fired) {
                $key.mousedown();
                fired = true;
            }
        }, function(){
            $key.mouseup();
            fired = false;
        });
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

    function bindEvents(){
        $("#sustain-switch").change(function(e){
            sustain = e.currentTarget.checked;
        });
    }

    return Keyboard;
});