define(function(){
    "use strict";

    var Player = function(){
        var self = this;

        if(Player.prototype.instance) {
            return Player.prototype.instance;
        }
        Player.prototype.instance = self;

        var wholeNoteDuration = 4; //seconds
        var volume = 127;
        init();

        function init(){
            MIDI.loadPlugin({
                soundfontUrl: "./soundfont/",
                instrument: "acoustic_grand_piano",
                callback: function(){
                    console.log("player ready");
                }
            });
        }

        self.playChord = function(chord){
            var duration = self.wholeNoteDuration / chord.duration;
            for(var i = 0; i < chord.notes.length; i++){
                var key = chord.notes[i].key,
                    octave = chord.notes[i].octave;
                self.startTone(key, octave);
                self.endTone(key, octave, duration);
            }
        };

        self.startTone = function(key, octave){
            var noteValue = MIDI.keyToNote[key + octave];
            MIDI.noteOn(0, noteValue, self.volume, 0);
        };

        self.endTone = function(key, octave, duration){
            var noteValue = MIDI.keyToNote[key + octave];
            MIDI.noteOff(0, noteValue, duration);
        };
    };

    return new Player();
});