var app = new App;

app.notesModel.addNote(['a/4'], 'q');
app.notesModel.addNote(['a/4'], '16');
app.notesModel.addNote(['b/4'], '8');
//app.notesModel.addNote('c/4', 'q');
//app.notesModel.addNote('a/4', '16');
//voices.notesModel[0].addTickable(new Vex.Flow.StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }));
app.notesView.draw();