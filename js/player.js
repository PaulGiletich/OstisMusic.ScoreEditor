OSTISMusic.PlayerLoader = {
    initPlayer: function(callback){
        MIDI.loadPlugin({
            soundfontUrl: "./soundfont/",
            instrument: "acoustic_grand_piano",
            callback: callback
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