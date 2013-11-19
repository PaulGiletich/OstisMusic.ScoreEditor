App = Backbone.View.extend({
    el: $("#view"),
    notesView: new NotesView(),
    notesModel: new NotesModel(),
    highlightedNote: undefined,
    events: {
        "click #add-note": "addNote",
        "click #add-bar": "addBar",
        "click #score" :"scoreClick"
    },
    addNote : function(){
        this.notesModel.addNote([$('input[name=key]').val()], $('input[name=duration]').val());
        this.notesView.draw();
    },
    addBar : function(){
        this.notesModel.addBar();
        this.notesView.draw();
    },
    scoreClick: function(ev){
        var coords = this.notesView.canvas.relMouseCoords(ev);
        this.highlightedNote = this.notesView.findNote(coords);
        this.notesView.draw();
    }
});
