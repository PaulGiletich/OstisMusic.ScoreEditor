define(['../model/all', 'es6!song-player', 'es6!instruments/basic-instrument'], function(Model, SongPlayer, BasicInstrument){

    class NoteCreationInstrument extends BasicInstrument {
        constructor (editor, $scope) {
            super(editor, $scope);
        };

        emptySpaceClicked (point) {
            super.emptySpaceClicked(point);
            var note = this.editor.view.getNewNoteByPos(point);
            var chord = new Model.Chord(this.editor.noteDuration, [note]);

            var prevNote = this.editor.view.findPreviousNote(point);
            //if track empty ( todo )
            if(!prevNote && !this.$scope.activeTrack.bars[0].tickables.length){
                this.$scope.activeTrack.insertTickable(0, chord);
            } else {
                this.$scope.activeTrack.insertTickable(prevNote.index+1, chord);
            }
        };

        emptySpaceHovered (coords) {
            this.editor.view.phantomNote({x: coords.x, y: coords.y - coords.y % 5});
        };
    }

    return NoteCreationInstrument;
});

