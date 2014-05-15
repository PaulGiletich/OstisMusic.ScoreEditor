define(['../model/all', 'es6!song-player', 'es6!instruments/basic-instrument'],
function(Model, SongPlayer, BasicInstrument){

    class RestCreationInstrument extends BasicInstrument {
        constructor (editor, $scope) {
            super(editor, $scope);
        };

        emptySpaceClicked (point) {
            super.emptySpaceClicked(point);
            var rest = new Model.Rest(this.editor.noteDuration);

            var prevNote = this.editor.view.findPreviousNote(point);
            //if track empty ( todo )
            if(!prevNote && !this.$scope.activeTrack.bars[0].tickables.length){
                this.$scope.activeTrack.insertTickable(0, rest);
            } else {
                this.$scope.activeTrack.insertTickable(prevNote.index+1, rest);
            }
        };

        emptySpaceHovered (point) {
            this.editor.view.phantomRest(point);
        };
    }

    return RestCreationInstrument;
});