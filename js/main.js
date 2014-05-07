require(['editor'], function(Editor){
    "use strict";

    var Model = require('model');

    var app = new Editor();

    var c1 = new Model.Chord(4, [new Model.Note('C', 5), new Model.Note('E', 5), new Model.Note('G', 5)]);
    var c2 = new Model.Chord(4, [new Model.Note('F', 5), new Model.Note('B', 5)]);
    var c3 = new Model.Chord(2, [new Model.Note('A', 4), new Model.Note('C', 5), new Model.Note('E', 5)]);
    var rest = new Model.Rest(1);

    var arr = [c1, c2, c3, rest];
    app.song = new Model.Song(arr, 2);
    app.update();
});

