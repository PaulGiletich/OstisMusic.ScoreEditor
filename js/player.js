define(function(){
    "use strict";

    var playerReady = new $.Deferred();
    var Player = {
        self: this,
        wholeNoteDuration: 4, //seconds
        volume: 127,

        init: function(callback){
            if(playerReady.state() == 'resolved'){
                return playerReady.promise();
            }

            MIDI.loadPlugin({
                soundfontUrl: "./soundfont/",
                instrument: "acoustic_grand_piano",
                callback: callback? callback : function(){
                    console.log("player ready");

                    playerReady.resolve(this);
                }
            });

            return playerReady.promise();
        },

        playChord: function(chord){
            var duration = self.wholeNoteDuration / chord.duration;
            for(var i = 0; i < chord.notes.length; i++){
                var key = chord.notes[i].key,
                    octave = chord.notes[i].octave;
                self.startTone(key, octave);
                self.endTone(key, octave, duration);
            }
        },

        startTone: function(key, octave){
            var noteValue = MIDI.keyToNote[key + octave];
            MIDI.noteOn(0, noteValue, self.volume, 0);
        },

        endTone: function(key, octave, duration){
            var noteValue = MIDI.keyToNote[key + octave];
            MIDI.noteOff(0, noteValue, duration);
        }
    };

    return Player;
});