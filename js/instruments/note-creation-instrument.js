define(['model', 'song-player'], function(Model, SongPlayer){
    "use strict";

    var NoteCreationInstrument = function(editor){

        this.scoreClick = function(e){
            var coords = editor.view.toLocalCoords(e);
            var note = editor.view.findNote(coords);
            if(note){
                noteClicked(note);
                return;
            }
            var lastNote = editor.view.findPreviousNote(coords);
            if(lastNote){
                addNote(coords);
            }
        };

        this.mouseMove = function(e){
            var coords = editor.view.toLocalCoords(e);
            var note = editor.view.findNote(coords);
            var prevNote = editor.view.findPreviousNote(coords);
            if(note){
                editor.view.highlightNote(note.view);
            }
            else if (prevNote){
                coords.y = coords.y - coords.y % 5;
                coords.x = prevNote.view.getAbsoluteX() + prevNote.view.getBoundingBox().w + 15;
                editor.view.phantomNote(coords);
            }
        };

        function noteClicked(note){
            $(document).trigger('playChord', note.index);
            editor.view.setSelectedNote(note.index);
        }

        function addNote(point){
            var prevNote = editor.view.findPreviousNote(point);
            var note = editor.view.getNewNoteByPos(point);
            var chord = new Model.Chord(editor.newNoteDuration, [note]);
            editor.song.insertTickable(prevNote.index+1, chord);
            editor.update();
            editor.view.setSelectedNote(prevNote.index+1);
        }
    };

    return NoteCreationInstrument;
});

