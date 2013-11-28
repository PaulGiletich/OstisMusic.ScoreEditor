OSTISMusic.View = (function(){

function View(){
        this.init();
    };

    View.prototype = {

        init: function(){
            this.canvas = $("#canvas")[0];
            this.hoverCanvas = $("#hoverCanvas")[0];
            this.selectionCanvas = $("#selectionCanvas")[0];
            this.renderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.CANVAS);
            Vex.Flow.Artist.NOLOGO = true;
            this.artist = new Vex.Flow.Artist(10, 10, 600, {});
            this.selectedNote = null;
        },

        update: function(){
            this.artist.render(this.renderer);
            this.hoverCanvas.width = this.selectionCanvas.width = this.canvas.width;
            this.hoverCanvas.height = this.selectionCanvas.height  = this.canvas.height;
        },

        findNote: function(point){
            var contains = OSTISMusic.Util.contains;
            var enlarge = OSTISMusic.Util.enlarge;

            var stave = this.findStave(point);
            if(!stave) return null;

            for (var j = 0; j < stave.note_voices.length; j++){
                var voice = stave.note_voices[j];
                for (var inote = 0; inote < voice.length; inote++){
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
            var lastNote;

            for(var j = 0; j < stave.note_voices.length; j++){
                var voice = stave.note_voices[j];
                for (var inote = 0; inote < voice.length; inote++){
                    var note = voice[inote];
                    if (note.getAbsoluteX() > point.x) {
                        return lastNote;
                    }
                    lastNote = {index: inote, view: note, model: app.song.voices[0].chords[inote]};
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
            var stave = this.findStave(point);
            var note = 0 + 7*7;    // note at top - C/7
            for(var i = stave.note.getYForLine(-5); i < stave.note.getYForLine(15); i += 5){
                if(point.y < i){
                    return new OSTISMusic.Note(OSTISMusic.Util.numberToNote[note % 7], Math.floor(note/7));
                }
                note--;
                //stave.getYForNote(MIDI.noteToKey[i])
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
            this.updateSelection();
        },

        updateSelection: function(){
            var ctx=this.selectionCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            if(!this.selectedNote) return;

            var rect = this.selectedNote.view.getBoundingBox();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle="#0000FF";
            ctx.roundRect(rect.x,rect.y,
            rect.w,rect.h, true, 6);
        }
    };

    return View;
})();