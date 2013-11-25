OSTISMusic.Editor = (function(){
    function Editor(){
        this.init();
    }

    Editor.prototype = {

        init: function(){
            this.view = new OSTISMusic.View();
            this.vextab = new Vex.Flow.VexTab(this.view.artist);
            this.song = new OSTISMusic.Song();

            $('#view').click(this.scoreClick.bind(this));
            $('#view').mousemove(this.mouseMove.bind(this));

            this.update();
        },

        scoreClick: function(e){
            var coords = this.view.canvas.relMouseCoords(e);
            var lastNote = this.view.findPreviousNote(coords);
            if(lastNote){
                this.addNote(coords);
            }
            this.selectedNote = this.view.findNote(coords);
        },

        mouseMove: function(e){
            var coords = this.view.canvas.relMouseCoords(e);
            var note = this.view.findNote(coords);
            if(note){
                this.highlightNote(note);
            }
            else {
                var x = coords.x;
                var y = coords.y - coords.y % 10;
                this.view.hoverRect({x:x, y:y, w:0, h:0});
            }
        },

        highlightNote: function(note){
            if(note){
                this.view.hoverRect(note.view.getBoundingBox());
            }
            else{
                this.view.clearHoverCanvas();
            }
        },

        addNote: function(point){
            var lastNote = this.view.findPreviousNote(point);
            var note = this.view.getNewNoteByPos(point);
            //var note = new OSTISMusic.Note('C', 4);
            var chord = new OSTISMusic.Chord($("#duration")[0].value, [note]);
            this.song.voices[0].chords.insert(lastNote.index, chord);
            this.update();
        },

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