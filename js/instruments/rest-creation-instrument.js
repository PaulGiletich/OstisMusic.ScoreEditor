OSTISMusic.Instrument.RestCreationInstrument = function(editor){

    this.scoreClick = function(e){
        var coords = editor.view.getLocalCoords(e);
        var note = editor.view.findNote(coords);
        if(note){
            noteClicked(note);
            return;
        }
        var lastNote = editor.view.findPreviousNote(coords);
        if(lastNote){
            addRest(coords);
        }
    };

    this.mouseMove = function(e){
        var coords = editor.view.getLocalCoords(e);
        var note = editor.view.findNote(coords);
        var prevNote = editor.view.findPreviousNote(coords);
        if(note){
            editor.view.highlightNote(note);
        }
        else if (prevNote){
            var x = prevNote.view.getAbsoluteX() + prevNote.view.getBoundingBox().w + 15;
            editor.view.phantomRest(x, editor.view.findStave(coords).note);
        }
    };

    function noteClicked(note){
        editor.player.playNote([note.view]);
        editor.view.setSelectedNote(note.index);
    }

    function addRest(point){
        var prevNote = editor.view.findPreviousNote(point);
        var tickable = new OSTISMusic.RestChord(editor.newNoteDuration);
        editor.song.insertTickable(prevNote.index+1, tickable);
        editor.update();
        editor.view.setSelectedNote(prevNote.index+1);
    }
};