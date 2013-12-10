/**
 * @constructor
 */
OSTISMusic.View = function (){
    var _this = this;
    var canvas = $("#canvas")[0]; canvas.width = $(".canvas-layers").innerWidth() - 100;
    var hoverCanvas = $("#hoverCanvas")[0];
    var selectionCanvas = $("#selectionCanvas")[0];

    var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
    var selectedNote = null;

    _this.artist = new Vex.Flow.Artist(0, 0, window.innerWidth); Vex.Flow.Artist.NOLOGO = true;
    _this.notesPerLine = 8;

    /**
     * re-render view
     */
    this.update = function(){
        _this.artist.render(renderer);
        hoverCanvas.width = selectionCanvas.width = canvas.width;
        hoverCanvas.height = selectionCanvas.height  = canvas.height;
        drawSelection();
    };

    /**
     * transforms event to local coordinated
     * @param event
     * @returns {}
     */
    this.toLocalCoords = function(event){
        return canvas.relMouseCoords(event);
    };

    /**
     * iterator by each note of view. if you done with it, return true in callback, so it will not iterate more
     * @param {Function} callback
     */
    this.eachNote = function(callback){
        var curr_i = -1;

        for (var si = 0; si < _this.artist.staves.length; si++){
            var stave = _this.artist.staves[si];

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

    /**
     * find note at specified position
     * @param {{x: Number, y: Number}} point
     * @returns {{index: Number, view: Vex.Flow.StaveNote}}
     */
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

    /**
     * find previous note by specified position
     * @param {{x: Number, y: Number}} point
     * @returns {{index: Number, view: Vex.Flow.StaveNote}}
     */
    this.findPreviousNote = function(point){
        var stave = this.findStave(point);
        if(!stave) return null;

        var result = null;
        this.eachNote(function(note, index){
            if (note.getStave() == stave.note && note.getAbsoluteX() > point.x) {
                return true;
            }
            //this happens in the end of line, next note x is not greater, but note is actually previous
            if (result && result.view.getStave() == stave.note && note.getStave() != stave.note) {
                return true;
            }
            //this happens at the start, when there is no previous note
            if(note.getStave() == stave.note && index == 0 && note.getAbsoluteX() > point.x){
                result = {index: -1};
                return true;
            }
            result =  {index: index, view: note};
            return false;
        });
        return result;
    };

    /**
     * find stave containing specified point
     * @param {{x: Number, y: Number}} point
     * @returns {Vex.Flow.Stave}
     */
    this.findStave = function(point){
        var contains = OSTISMusic.Util.contains;

        for (var i = 0; i < _this.artist.staves.length; i++){
            var stave = _this.artist.staves[i];
            var boundingBox = stave.note.getBoundingBox();
            boundingBox.h -= 20;
            if(contains(boundingBox, point)){
                return stave;
            }
        }
        return null;
    };

    /**
     * get new note object by point on stave
     * @param {{x: Number, y: Number}} point
     * @returns {OSTISMusic.Note}
     */
    this.getNewNoteByPos = function(point){
        var stave = this.findStave(point).note;

        // spacing between two neighbour notes
        var spacing = stave.options.spacing_between_lines_px / 2;

        // starting from -5th stave line
        // presenting current note as digit: note = key + octave * notes per octave(7)
        // note at -5th line - C/7
        var note = OSTISMusic.Util.getNoteNumberByKey('C') + 7*7;

        for(var i = stave.getYForLine(-5); i < stave.getYForLine(15); i += spacing, note--){
            if(point.y < i){
                //if we reach y pos, convert digit note to model representation and return result
                return new OSTISMusic.Note(OSTISMusic.Util.getKeyByNumber(note % 7), Math.floor(note/7));
            }
        }
        return null;
    };

    /**
     * draws phantom note at point
     * @param {{x: Number, y: Number}} point
     */
    this.phantomNote = function(point){
        var ctx=hoverCanvas.getContext("2d");
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle="#000000";
        ctx.roundRect(point.x,point.y,
            0,0, true, 5);
    };

    /**
     * draws phantom rest at specified point
     * @param {{x: Number, y: Number}} p
     */
    this.phantomRest = function(p){
        var ctx=hoverCanvas.getContext("2d");
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle="#000000";

        var stave = _this.findStave(p).note;
        ctx.roundRect(p.x,stave.getYForLine(1),
            0,stave.getYForLine(3) - stave.getYForLine(1), true, 5);
    };

    /**
     * highlights specified note
     * @param {Vex.Flow.StaveNote} note
     */
    this.highlightNote = function(note){
        var ctx=hoverCanvas.getContext("2d");
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        if(!note) return;

        var rect = note.getBoundingBox();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle="#0000FF";
        ctx.roundRect(rect.x,rect.y,
            rect.w,rect.h, true, 6);
    };

    /**
     * function called when note is playing
     * @param {{index: Number, view: Vex.Flow.StaveNote}} note
     */
    this.playingNote = function(note){
        this.setSelectedNote(note.index);//TODO proper playing note indication
    };

    /**
     *
     * @param {Number} index
     */
    this.setSelectedNote = function(index){
        if (index < 0) return;
        if (this.getTickable(index) == null) {
            this.setSelectedNote(index-1);
            return;
        }
        selectedNote = index;
        drawSelection();
    };

    /**
     * @returns {Number}
     */
    this.getSelectedNote = function(){
        return selectedNote;
    };

    /**
     * @returns {Number}
     */
    this.getWidth = function(){
        return canvas.width;
    };

    /**
     * @param {Number} width
     */
    this.setWidth = function(width){
        canvas.width = width;
        this.update();
    };

    /**
     * @param {Number} index
     * @returns {Vex.Flow.Tickable}
     */
    this.getTickable = function(index){
        var result = null;
        this.eachNote(function(note, i){
            if(i == index){
                result = {index: i, view: note};
                return true;
            }
            return false;
        });
        return result;
    };

    /**
     * draws current selection highlight
     */
    function drawSelection(){
        var ctx = selectionCanvas.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if(selectedNote != null){
            var rect = _this.getTickable(selectedNote).view.getBoundingBox();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = "#0000FF";
            ctx.roundRect(rect.x, rect.y,
                rect.w, rect.h, true, 6);
        }
    }

};