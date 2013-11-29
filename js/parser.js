OSTISMusic.Parser = (function(){
    function Parser(){
        this.init();
    }

    Parser.prototype = {
        init: function(){
        },

        parse: function(song){
            var result = "\ntabstave notation=true tablature=false\nvoice\nnotes ";

            var line_notes = 0;

            for(var i = 0; i < song.tickables.length; i++){
                var tickable = song.tickables[i];

                if(tickable instanceof OSTISMusic.Chord){
                    result += this.parseChord(tickable);
                }
                if(tickable instanceof OSTISMusic.BarNote){
                    result += tickable.toString();
                }

                if(++line_notes == 10 && i != song.tickables.length-1){
                    result += "\ntabstave notation=true clef=none tablature=false\nvoice\nnotes ";
                    line_notes = 0;
                }
                result += " ";
            }
            if(line_notes < 10) {
                result += ":1 ##";
            }
            return result;
        },

        parseChord: function(chord){
            var result = ":" + chord.duration + " ";

            var notes = [];
            for(var ni = 0; ni < chord.notes.length; ni++){
                var note = chord.notes[ni];
                notes.push(this.parseNote(note));
            }

            if(notes.length > 1){
                result += "(" + notes.join(".") + ")";
            }
            else {
                result += notes[0];
            }
            return result;
        },

        parseNote: function(note){
            return note.key + "/" + note.octave;
        }
    };

    return Parser;
})();