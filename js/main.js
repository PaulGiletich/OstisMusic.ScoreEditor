var app = new OSTISMusic.Editor();

//populate model
var note1 = new OSTISMusic.Note('C', 5);
var note2 = new OSTISMusic.Note('D', 5);
var note3 = new OSTISMusic.Note('E', 5);
var note4 = new OSTISMusic.Note('F', 5);
var note5 = new OSTISMusic.Note('G', 5);
var note6 = new OSTISMusic.Note('A', 4);
var note7 = new OSTISMusic.Note('B', 5);

var chord = new OSTISMusic.Chord(16, [note1, note3, note5]);
var chord2 = new OSTISMusic.Chord(4, [note2, note5]);
var chord3 = new OSTISMusic.Chord(8, [note3, note6]);
var chord4 = new OSTISMusic.Chord(32, [note4, note7]);
var chord5 = new OSTISMusic.Chord(64, [note5, note1]);
var chord6 = new OSTISMusic.Chord(16, [note6, note1, note3]);
var chord7 = new OSTISMusic.Chord(4, [note7, note3]);
var voice = new OSTISMusic.Voice([chord, chord2, chord3, chord4,
    new OSTISMusic.Chord(4, [new OSTISMusic.BarNote("DOUBLE")]),
    chord5, chord6, chord7,
    new OSTISMusic.Chord(4, [new OSTISMusic.BarNote("SINGLE")]),
    chord]);

app.song.voices.push(voice);
app.update();

//TODO: iterator with model and view keys united
//TODO: migrate to vexflow drawing