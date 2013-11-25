OSTISMusic.App = (function(){
    function App(){
        this.init();
    }

    App.prototype = {
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
            this.highlightedNote = this.view.findNote(coords);
        },
        mouseMove: function(e){
            var coords = this.view.canvas.relMouseCoords(e);
            this.highlightNote(this.view.findNote(coords));
        },
        highlightNote: function(note){
            if(note){
                this.view.hoverRect(note.view.getBoundingBox());
            }
            else{
                this.view.clearHoverCanvas();
            }
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

    return App;
})();