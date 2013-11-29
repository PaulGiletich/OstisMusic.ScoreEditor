OSTISMusic.Player = (function(){
    function Player(){
        this.init();
    }

    Player.prototype = {

        init: function(){
            this.volume = 127;
            this.wholeNoteDuration = 4;//seconds

            console.log("loading player");
            MIDI.loadPlugin({
                soundfontUrl: "./soundfont/",
                instrument: "acoustic_grand_piano",
                callback: function() {
                    MIDI.setVolume(0, 127);
                    console.log("player ready");
                }
            });
        },

        playChord: function(chord){
            var duration = this.wholeNoteDuration / chord.duration;
            for(var i = 0; i < chord.notes.length; i++){
                var note = chord.notes[i];
                var noteValue = MIDI.keyToNote[note.key + note.octave];
                MIDI.noteOn(0, noteValue, this.volume, 0);
                MIDI.noteOff(0, noteValue, duration);
            }
        }
    };

    return Player;
}());