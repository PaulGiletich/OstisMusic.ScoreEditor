define(function(require){
    "use strict";
    var Model = require('model');

    var Player = function(){
        var self = this;

        if(Player.prototype.instance) {
            return Player.prototype.instance;
        }
        Player.prototype.instance = self;

        var volume = 127;

        MIDI.loadPlugin({
            soundfontUrl: "./soundfont/",
            instrument: "acoustic_grand_piano",
            callback: function () {
                $(document).trigger('playerReady');
            }
        });

        self.playChord = function(chord, duration, delay){
            if(chord instanceof Model.Rest) return;
            delay = delay ? delay : 0;
            for(var i = 0; i < chord.notes.length; i++){
                var key = chord.notes[i].key,
                    octave = chord.notes[i].octave;
                self.startTone(key, octave, delay);
                self.endTone(key, octave, duration + delay);
            }
        };

        self.startTone = function(key, octave, delay){
            delay = delay ? delay : 0;
            var noteValue = MIDI.keyToNote[key + octave];
            try {
                MIDI.noteOn(0, noteValue, self.volume, delay);
            } catch(err) {
                //aha
            }
        };

        self.endTone = function(key, octave, delay){
            delay = delay ? delay : 0;
            var noteValue = MIDI.keyToNote[key + octave];
            try{
                MIDI.noteOff(0, noteValue, delay);
            }catch (err){
                //fuck MIDI
            }
        };
    };

    return new Player();
});