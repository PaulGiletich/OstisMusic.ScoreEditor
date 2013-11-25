var app = new OSTISMusic.App();

//populate model
var note1 = new OSTISMusic.Note('C', 5);
var note2 = new OSTISMusic.Note('E', 4);
var note3 = new OSTISMusic.Note('A', 5);
var chord = new OSTISMusic.Chord(16, [note1, note2]);
var chord2 = new OSTISMusic.Chord(4, [note2]);
var chord3 = new OSTISMusic.Chord(8, [note3]);
var voice = new OSTISMusic.Voice([chord, chord2, chord3, chord2, chord, chord, chord3, chord2, chord3]);

app.song.voices.push(voice);
app.update();