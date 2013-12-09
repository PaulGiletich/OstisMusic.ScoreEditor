OSTISMusic.Parser = function (view){
    //we need view here to access it's width and notesPerLine options

    this.parse = function(song){
        var result = "";

        var fillness = 0;
        var staveTickables = [];
        song.eachNote(function(tickable, index){
            if(tickable instanceof OSTISMusic.BarNote){
                staveTickables.push(tickable.toString());
            }
            if(tickable instanceof OSTISMusic.Chord){
                staveTickables.push(parseChord(tickable));
                fillness += 1/tickable.duration;
            }
            if(tickable instanceof OSTISMusic.RestChord){
                staveTickables.push(parseRestChord(tickable));
                fillness += 1/tickable.duration;
            }

            if(staveTickables.length == view.notesPerLine && index != song.tickables.length-1){
                result += makeStave(staveTickables, view.getWidth());
                staveTickables = [];
            }
        });
        result += makeStave(staveTickables, view.getWidth() * (staveTickables.length/view.notesPerLine));
        return result;
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
        var result = "";
        result += note.key;
        if(note.sharp){
            result += "#";
        }
        if(note.flat){
            result += "@";
        }
        result += "/" + note.octave;
        return result;
    }

    function parseRestChord(chord){
        return ":" + chord.duration + " ##";
    }
};
