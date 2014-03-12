define(['util', 'player'], function(Util, Player){
    "use strict";
    var self = this;
    var $keyboard = $('.keyboard');

    Player.init();

    var Keyboard = {
        init: function(){
            var notesCount = 36;
            var startOctave = 4;

            for(var i = 0; i < notesCount; i++){
                var note = Util.keyboardNotes[i % 12];
                var octave = startOctave + Math.floor(i/12);
                if(note.indexOf('b') == -1){
                    $keyboard.append(createKey(note, octave));
                } else {
                    $keyboard.append(createBlackKey(note, octave));
                }
            }
        }
    };

    //TODO move to handlebars or dust.js
    function createKey(note, octave){
        var $key =  $('<div class="key-white-wrapper">')
            .append($('<div class="key">')
                .append($('<div class="key-text">')
                    .text(note + octave)));
        $key.children().mousedown(function(e){
            $(e.currentTarget).addClass('key-pressed');
            Player.startTone(note, octave);
        });
        $key.children().mouseup(function(e){
            $('.key').removeClass('key-pressed');
            Player.endTone(note, octave);
        });
        return $key;
    }

    function createBlackKey(note, octave){
        var $key =  $('<div class="key-black-wrapper">')
            .append($('<div class="key key-black">')
                .append($('<div class="key-text">')
                    .text(note + octave)));
        $key.children().mousedown(function(e){
            $(e.currentTarget).addClass('key-pressed');
            Player.startTone(note, octave);
        });
        $key.children().mouseup(function(e){
            $('.key').removeClass('key-pressed');
            Player.endTone(note, octave);
        });
        return $key;
    }

    return Keyboard;
});