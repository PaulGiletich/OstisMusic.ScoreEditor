OSTISMusic.View = (function(){

function View(){
        this.init();
    };

    View.prototype = {

        init: function(){
            this.canvas = $("#canvas")[0];
            this.hoverCanvas = $("#hoverCanvas")[0];
            this.renderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.CANVAS);
            Vex.Flow.Artist.NOLOGO = true;
            this.artist = new Vex.Flow.Artist(10, 10, 600, {});
        },

        update: function(){
            this.artist.render(this.renderer);
            this.hoverCanvas.width = this.canvas.width;
            this.hoverCanvas.height = this.canvas.height;
        },

        findNote: function(point){
            var contains = OSTISMusic.Util.contains;
            var enlarge = OSTISMusic.Util.enlarge;

            var stave = this.findStave(point);
            if(!stave) return null;

            for(var j = 0; j < stave.note_voices.length; j++){
                var voice = stave.note_voices[j];
                for(var inote = 0; inote < voice.length; inote++){
                    var note = voice[inote];
                    if(contains(enlarge(note.getBoundingBox(), 8), point)){
                        return {index: inote, view: note, model: app.song.voices[0].chords[inote]};
                    }
                }
            }
            return null;
        },

        findPreviousNote: function(point){
            var stave = this.findStave(point);
            if(!stave) return null;

            for(var j = 0; j < stave.note_voices.length; j++){
                var voice = stave.note_voices[j];
                for(var inote = 0; inote < voice.length; inote++){
                    var note = voice[inote];
                    var lastNote = {index: inote, view: note, model: app.song.voices[0].chords[inote]};
                    if (note.getBoundingBox().x > point.x) {
                        return lastNote;
                    }
                }
            }
            return null;
        },

        findStave: function(point){
            var contains = OSTISMusic.Util.contains;

            for (var i = 0; i < this.artist.staves.length; i++){
                var stave = this.artist.staves[i];
                var boundingBox = stave.note.getBoundingBox();
                if(contains(boundingBox, point)){
                    return stave;
                }
            }
        },

        getNewNoteByPos: function(point){
            var line = this.getLineByPos(point);
            return this.getNoteByLine(line);
        },

        getLineByPos: function(point){
            var stave = this.findStave(point);
            for (var i = 0; i < 5; i++){
                if(point.y < stave.note.getYForLine(i+1)){
                    return i;
                }
            }
            return 5;
        },

        getNoteByLine: function(line){//TODO: temporary
            noteByLine = {
                0: new OSTISMusic.Note('F', 5),
                1: new OSTISMusic.Note('D', 5),
                2: new OSTISMusic.Note('B', 4),
                3: new OSTISMusic.Note('G', 4),
                4: new OSTISMusic.Note('E', 4)
            };
            return noteByLine[line];
        },

        hoverRect: function(rect){
            this.clearHoverCanvas();
            var ctx=this.hoverCanvas.getContext("2d");
            ctx.globalAlpha = 0.3;
            ctx.fillStyle="#0000FF";
            ctx.roundRect(rect.x,rect.y,
                rect.w,rect.h, true, 6);
        },

        clearHoverCanvas: function(){
            var ctx=this.hoverCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        }
    };

    return View;
})();