function NotesModel(){
    this.notes = [];
}

NotesModel.prototype.addNote = function(keys, duration){
    this.notes.push(new Vex.Flow.StaveNote({ keys: keys, duration: duration }));
};

NotesModel.prototype.addBar = function(){
    this.notes.push(new Vex.Flow.BarNote());
};