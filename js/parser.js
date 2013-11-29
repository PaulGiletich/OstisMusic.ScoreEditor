OSTISMusic.Parser = (function(){
    function Parser(view){
        this.view = view;
    }

    Parser.prototype = {

        parse: function(song){
            var result = "";

            var fillness = 0;
            var staveNotes = [];
            song.eachNote(function(tickable, index){
                if(tickable instanceof OSTISMusic.BarNote){
                    staveNotes.push(tickable.toString());
                }
                if(tickable instanceof OSTISMusic.Chord){
                    staveNotes.push(parseChord(tickable));
                    fillness += 1/tickable.duration;
                }

                if(staveNotes.length == this.view.notesPerLine && index != song.tickables.length-1){
                    result += makeStave(staveNotes, this.view.getWidth());
                    staveNotes = [];
                }

            }.bind(this));
            result += makeStave(staveNotes, this.view.getWidth() * (staveNotes.length/this.view.notesPerLine));
            return result;
        }
    };

    function makeStave(staveNotes, width){
        if(staveNotes.length == 0){
            return "";
        }
        var result = "\n\noptions " +
            "player=true" +
            " width=" + width;
        result += "\ntabstave notation=true clef=none tablature=false\nvoice\nnotes ";
        result += staveNotes.join(" ");
        return result;
    }

    function parseChord(chord){
        var result = ":" + chord.duration + " ";

        var notes = [];
        for(var ni = 0; ni < chord.notes.length; ni++){
            var note = chord.notes[ni];
            notes.push(parseNote(note));
        }

        if(notes.length > 1){
            result += "(" + notes.join(".") + ")";
        }
        else {
            result += notes[0];
        }
        return result;
    }

    function parseNote(note){
        return note.key + "/" + note.octave;
    }

    return Parser;
})();