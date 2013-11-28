//controller
OSTISMusic.Editor = (function(){
    function Editor(){
        this.init();
    }

    Editor.prototype = {

        init: function(){
            this.view = new OSTISMusic.View();//view
            this.vextab = new Vex.Flow.VexTab(this.view.artist);//model to view parser
            this.song = new OSTISMusic.Song();//model
            this.player = new OSTISMusic.Player();
//            this.drawer = new OSTISMusic.Drawer();
//            this.parser = new OSTISMusic.Parser();

            $('#view').click(this.scoreClick.bind(this));
            $('#view').mousemove(this.mouseMove.bind(this));

            this.update();
        },

        scoreClick: function(e){
            var coords = this.view.canvas.relMouseCoords(e);
            var note = this.view.findNote(coords);
            if(note){
                this.noteClicked(note);
                return;
            }
            var lastNote = this.view.findPreviousNote(coords);
            if(lastNote){
                this.addNote(coords);
            }
        },

        noteClicked: function(note){
            this.player.playChord(note.model);

            this.view.setSelectedNote(note);
        },

        mouseMove: function(e){
            var coords = this.view.canvas.relMouseCoords(e);
            var note = this.view.findNote(coords);
            var prevNote = this.view.findPreviousNote(coords);
            if(note){
                this.view.highlightNote(note);
            }
            else if (prevNote){
                this.view.highlightNote(prevNote);
                coords.y = coords.y - coords.y % 5;
                coords.x = prevNote.view.getAbsoluteX() + prevNote.view.getBoundingBox().w + 10;
                this.view.phantomNote(coords);
            }
        },

        addNote: function(point){
            var prevNote = this.view.findPreviousNote(point);
            var note = this.view.getNewNoteByPos(point);
            var chord = new OSTISMusic.Chord($("#duration")[0].value, [note]);
            OSTISMusic.Util.insertToArray(this.song.voices[0].chords, prevNote.index+1, chord);
            this.update();
        },

        /**
         * reparse model and update view
         */
        update: function(){
            try {
                this.vextab.reset();
                this.view.artist.reset();
                this.vextab.parse(this.song.toString());
                this.view.update();
                $("#error").text("");
            } catch (e) {
                console.log(e);
                $("#error").text(e.message);
            }
        }
    };

    return Editor;
})();