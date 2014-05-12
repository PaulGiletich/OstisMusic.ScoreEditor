define(['model/all', 'es6!song-player'], function(Model, SongPlayer){

    class BasicInstrument {
        constructor(editor, $scope){
            this.editor = editor;
            this.$scope = $scope;
        }

        scoreClick(e){
            var coords = this.editor.view.toLocalCoords(e);
            var note = this.editor.view.findNote(coords);
            if(note){
                this.noteClicked(note);
            } else{
                this.emptySpaceClicked(coords);
            }
        };

        mouseMove(e){
            var coords = this.editor.view.toLocalCoords(e);
            var note = this.editor.view.findNote(coords);
            if(note){
                this.noteHovered(note);
            }
            else {
                this.emptySpaceHovered(coords);
            }
        };

        noteClicked(note){
            var ti = this.$scope.activeTrack.tickableByIndexInTrack(note.index);
            this.$scope.selection = [ti, ti];
            SongPlayer.play(this.$scope.song, ti, ti, true);
        };

        emptySpaceClicked(coords){
            // abstract
        };

        noteHovered(note){
            this.editor.view.highlightNote(note.view);
        };

        emptySpaceHovered(coords){
            // abstract
        };
    }

    return BasicInstrument;
});