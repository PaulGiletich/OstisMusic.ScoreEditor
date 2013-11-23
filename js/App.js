OSTISMusic.App = (function(){
    function App(){
        this.init();
    }

    App.prototype = {
        init: function(){
            this.view = new OSTISMusic.View();
            this.vextab = new Vex.Flow.VexTab(this.view.artist);

            $("#notation").keyup(this.update.bind(this));
            $('#view').click(this.scoreClick.bind(this));

            this.update();
        },
        scoreClick: function(e){
            var coords = this.view.canvas.relMouseCoords(e);
            this.highlightedNote = this.view.findNote(coords);
        },
        update: function(){
            try {
                this.vextab.reset();
                this.view.artist.reset();
                this.vextab.parse($("#notation").val());
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