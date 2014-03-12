define(['model'], function(Model){
    "use strict";

    var RestCreationInstrument = function(editor){

        this.scoreClick = function(e){
            var coords = editor.view.toLocalCoords(e);
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
            var coords = editor.view.toLocalCoords(e);
            var note = editor.view.findNote(coords);
            var prevNote = editor.view.findPreviousNote(coords);
            if(note){
                editor.view.highlightNote(note.view);
            }
            else if (prevNote){
                var x = prevNote.view.getAbsoluteX() + prevNote.view.getBoundingBox().w + 15;
                var y = coords.y;
                editor.view.phantomRest({x:x, y:y});
            }
        };

        function noteClicked(note){
            editor.player.playNote([note.view]);
            editor.view.setSelectedNote(note.index);
        }

        function addRest(point){
            var prevNote = editor.view.findPreviousNote(point);
            var tickable = new Model.Rest(editor.newNoteDuration);
            editor.song.insertTickable(prevNote.index+1, tickable);
            editor.update();
            editor.view.setSelectedNote(prevNote.index+1);
        }
    };

    return RestCreationInstrument;
});