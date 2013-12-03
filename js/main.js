var app = new OSTISMusic.Editor();

var chord = new OSTISMusic.Chord(16, [new OSTISMusic.Note('C', 5), new OSTISMusic.Note('E', 5), new OSTISMusic.Note('G', 5)]);
var chord2 = new OSTISMusic.Chord(4, [new OSTISMusic.Note('D', 5), new OSTISMusic.Note('G', 5)]);
var chord3 = new OSTISMusic.Chord(8, [new OSTISMusic.Note('E', 5), new OSTISMusic.Note('A', 4)]);
var chord4 = new OSTISMusic.Chord(32, [new OSTISMusic.Note('F', 5), new OSTISMusic.Note('B', 5)]);
var chord5 = new OSTISMusic.Chord(64, [new OSTISMusic.Note('G', 5), new OSTISMusic.Note('C', 5)]);
var chord6 = new OSTISMusic.Chord(16, [new OSTISMusic.Note('A', 4), new OSTISMusic.Note('C', 5), new OSTISMusic.Note('E', 5)]);
var chord7 = new OSTISMusic.Chord(4, [new OSTISMusic.Note('B', 5), new OSTISMusic.Note('E', 5)]);

app.setSong(new OSTISMusic.Song([chord, chord2, chord3, chord4, chord5, chord6, chord7]));

//todo:html5 drag'n'drop
//TODO: instruments panel on left