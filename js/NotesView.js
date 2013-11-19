function NotesView(){
    this.canvas = $("#score")[0];
    this.context = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.CANVAS).getContext();
    this.formatter = undefined;
    this.start_x = undefined;
    this.note_width = 50;
}

NotesView.prototype.drawHighlightNote = function(stave){
    if(app.highlightedNote != undefined){
        var tickable = this.formatter.tContexts.map[this.formatter.tContexts.list[app.highlightedNote]];
        this.context.save();

        var g =  this.context.createLinearGradient(this.start_x + tickable.getX(), 0,
            this.start_x + tickable.getX() + 40, 0);
        g.addColorStop(0, "transparent");
        g.addColorStop(0.5, "rgba(0,0,255,0.2)");
        g.addColorStop(1, "transparent");
        this.context.fillStyle = g;
        this.context.fillRect(this.start_x + tickable.getX(), stave.getYForNote(7),
            50, stave.getYForNote(-1)-stave.getYForNote(7));
        this.context.restore();
    }
};

NotesView.prototype.draw = function(){
    this.context.clear();
    var stave = new Vex.Flow.Stave(0, 0, 100 + app.notesModel.notes.length * this.note_width);
    stave.addClef("treble");
    stave.setContext(this.context);

    var voice = new Vex.Flow.Voice({
        num_beats: 8,
        beat_value: 8,
        resolution: Vex.Flow.RESOLUTION
    });
    voice.setStrict(false);
    voice.addTickables(app.notesModel.notes);

    stave.draw();
    this.formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice]);
    voice.draw(this.context, stave);

    this.start_x = stave.start_x + stave.glyph_start_x;

    this.drawHighlightNote(stave);
};

NotesView.prototype.findNote = function(coords){
    var formatter = this.formatter;
    for (var i = 0; i < formatter.tContexts.list.length; i++){
        var note = formatter.tContexts.list[i];
        var nextNote = formatter.tContexts.list[i+1];
        if(coords.x > formatter.tContexts.map[note].getX() + this.start_x
            && (nextNote == undefined || coords.x < formatter.tContexts.map[nextNote].getX() + this.start_x)){
            break;
        }
    }
    return i;
};