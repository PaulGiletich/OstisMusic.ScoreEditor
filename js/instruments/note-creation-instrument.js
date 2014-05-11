define(['model/all', 'es6!song-player'], function(Model, SongPlayer){
    "use strict";

    var NoteCreationInstrument = function(editor, $scope){

        this.scoreClick = function(e){
            var coords = editor.view.toLocalCoords(e);
            var note = editor.view.findNote(coords);
            if(note){
                noteClicked(note);
                return;
            }
            addNote(coords);
        };

        this.mouseMove = function(e){
            var coords = editor.view.toLocalCoords(e);
            var note = editor.view.findNote(coords);
            var prevNote = editor.view.findPreviousNote(coords);
            if(note){
                editor.view.highlightNote(note.view);
            }
            else {
                coords.y = coords.y - coords.y % 5;
                //coords.x = prevNote.view.getAbsoluteX() + prevNote.view.getBoundingBox().w + 15;
                editor.view.phantomNote(coords);
            }
        };

        function noteClicked(note){
            var ti = $scope.activeTrack.tickableByIndexInTrack(note.index);
            SongPlayer.play($scope.song, ti, ti, true);
            $scope.selection = [ti, ti];
        }

        function addNote(point){
            var note = editor.view.getNewNoteByPos(point);
            var chord = new Model.Chord(editor.noteDuration, [note]);

            var prevNote = editor.view.findPreviousNote(point);
            //if track empty ( todo )
            if(!prevNote && !$scope.activeTrack.bars[0].tickables.length){
                $scope.activeTrack.insertTickable(0, chord);
            } else {
                $scope.activeTrack.insertTickable(prevNote.index+1, chord);
            }
        }
    };

    return NoteCreationInstrument;
});

