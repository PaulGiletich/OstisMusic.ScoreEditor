OSTISMusic.View = (function(){

    function View(){
        this.init();
    };

    var artist = new Vex.Flow.Artist(10, 10, 600, {});

    View.prototype = {

        init: function(){
            this.canvas = $("#canvas")[0];
            this.hoverCanvas = $("#hoverCanvas")[0];
            this.selectionCanvas = $("#selectionCanvas")[0];
            this.renderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.CANVAS);
            Vex.Flow.Artist.NOLOGO = true;
            //artist = new Vex.Flow.Artist(10, 10, 600, {});
            this.selectedNote = null;
        },

        update: function(){
            artist.render(this.renderer);
            this.hoverCanvas.width = this.selectionCanvas.width = this.canvas.width;
            this.hoverCanvas.height = this.selectionCanvas.height  = this.canvas.height;
        },

        eachNote: function(callback){
            var curr_i = -1;

            for (var si = 0; si < artist.staves.length; si++){
                var stave = artist.staves[si];

                for (var vi = 0; vi < stave.note_voices.length; vi++){
                    var voice = stave.note_voices[vi];

                    for (var ni = 0; ni < voice.length; ni++){
                        var note = voice[ni];

                        curr_i++;
                        var isEnough = callback(note, curr_i);
                        if (isEnough) {
                            return;
                        }
                    }
                }
            }
        },

        findNote: function(point){
            var contains = OSTISMusic.Util.contains;
            var enlarge = OSTISMusic.Util.enlarge;

            var result = null;
            this.eachNote(function(note, index){
                if(contains(enlarge(note.getBoundingBox(), 8), point)){
                    result = {index: index, view: note};
                    return true;
                }
                return false;
            });
            return result;
        },

        findPreviousNote: function(point){
            var stave = this.findStave(point);
            if(!stave) return null;

            var prevNote = null;
            this.eachNote(function(note, index){
                if (note.getStave() == stave.note && note.getAbsoluteX() > point.x) {
                    return true;
                }
                //this happens in the end of line, next note x is not greater, but note is actually previous
                if (prevNote && prevNote.view.getStave() == stave.note && note.getStave() != stave.note) {
                    return true;
                }
                prevNote =  {index: index, view: note};
                return false;
            });
            return prevNote;
        },

        findStave: function(point){
            var contains = OSTISMusic.Util.contains;

            for (var i = 0; i < artist.staves.length; i++){
                var stave = artist.staves[i];
                var boundingBox = stave.note.getBoundingBox();
                if(contains(boundingBox, point)){
                    return stave;
                }
            }
            return null;
        },

        getNewNoteByPos: function(point){
            var stave = this.findStave(point);
            var note = 0 + 7*7;    // note at top - C/7
            for(var i = stave.note.getYForLine(-5); i < stave.note.getYForLine(15); i += 5){
                if(point.y < i){
                    return new OSTISMusic.Note(OSTISMusic.Util.numberToNote[note % 7], Math.floor(note/7));
                }
                note--;
            }

            var line = this.getLineByPos(point);
            return this.getNoteByLine(line);
        },

        phantomNote: function(point){
            var ctx=this.hoverCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

            ctx.globalAlpha = 0.5;
            ctx.fillStyle="#000000";
            ctx.roundRect(point.x,point.y,
                0,0, true, 5);
        },

        highlightNote: function(note){
            var ctx=this.hoverCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            if(!note) return;

            var rect = note.view.getBoundingBox();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle="#0000FF";
            ctx.roundRect(rect.x,rect.y,
                rect.w,rect.h, true, 6);
        },

        setSelectedNote: function(note){
            this.selectedNote = note;
            updateSelection();
        },

        getArtist: function(){
            return artist;
        }
    };

    function updateSelection(){
        var ctx=this.selectionCanvas.getContext("2d");
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        if(!this.selectedNote) return;

        var rect = this.selectedNote.view.getBoundingBox();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle="#0000FF";
        ctx.roundRect(rect.x,rect.y,
            rect.w,rect.h, true, 6);
    }

    return View;
})();