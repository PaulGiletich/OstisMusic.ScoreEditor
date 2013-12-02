OSTISMusic.View = function (){
    var canvas = $("#canvas")[0];
    canvas.width = $(".canvas-layers").innerWidth() - 100;
    var hoverCanvas = $("#hoverCanvas")[0];
    var selectionCanvas = $("#selectionCanvas")[0];

    var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

    var artist = new Vex.Flow.Artist(0, 0, window.innerWidth); Vex.Flow.Artist.NOLOGO = true;
    var selectedNote = null;

    this.notesPerLine = 8;

    this.update = function(){
        artist.render(renderer);
        hoverCanvas.width = selectionCanvas.width = canvas.width;
        hoverCanvas.height = selectionCanvas.height  = canvas.height;
        drawSelection.call(this);
    };

    this.getLocalCoords = function(event){
        return canvas.relMouseCoords(event);
    };

    this.eachNote = function(callback){
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
    };

    this.findNote = function(point){
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
    };

    this.findPreviousNote = function(point){
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
    };

    this.findStave = function(point){
        var contains = OSTISMusic.Util.contains;

        for (var i = 0; i < artist.staves.length; i++){
            var stave = artist.staves[i];
            var boundingBox = stave.note.getBoundingBox();
            boundingBox.h -= 20;
            if(contains(boundingBox, point)){
                return stave;
            }
        }
        return null;
    };

    this.getNewNoteByPos = function(point){
        var stave = this.findStave(point);
        var note = 0 + 7*7;    // note at top - C/7
        for(var i = stave.note.getYForLine(-5); i < stave.note.getYForLine(15); i += 5){
            if(point.y < i){
                return new OSTISMusic.Note(OSTISMusic.Util.numberToNote[note % 7], Math.floor(note/7));
            }
            note--;
        }
    };

    this.phantomNote = function(point){
        var ctx=hoverCanvas.getContext("2d");
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle="#000000";
        ctx.roundRect(point.x,point.y,
            0,0, true, 5);
    };

    this.highlightNote = function(note){
        var ctx=hoverCanvas.getContext("2d");
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        if(!note) return;

        var rect = note.view.getBoundingBox();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle="#0000FF";
        ctx.roundRect(rect.x,rect.y,
            rect.w,rect.h, true, 6);
    };

    this.playingNote = function(note){
        this.setSelectedNote(note.index);//TODO: this is temporary
    };

    this.setSelectedNote = function(index){
        selectedNote = index;
        drawSelection.call(this); //TODO how to avoid this crap, i want my this be at the same a place
    };

    this.clearSelection = function(){
        return this.setSelectedNote(null);
    };

    this.getSelectedNote = function(){
        return selectedNote;
    };

    this.getArtist = function(){
        return artist;
    };

    this.getWidth = function(){
        return canvas.width;
    };

    this.setWidth = function(width){
        canvas.width = width;
        this.update();
    };

    this.getTickable = function(index){
        var result;
        this.eachNote(function(note, i){
            if(i == index){
                result = {index: i, view: note};
                return true;
            }
            return false;
        });
        return result;
    };

    function drawSelection(){
        var ctx = selectionCanvas.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if(selectedNote != null){
            var rect = this.getTickable(selectedNote).view.getBoundingBox();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = "#0000FF";
            ctx.roundRect(rect.x, rect.y,
                rect.w, rect.h, true, 6);
        }
    }

};