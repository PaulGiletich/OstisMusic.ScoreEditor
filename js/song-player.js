define(function(require){
    "use strict";
    var Player = require('player');

    var SongPlayer = {
        play: function (song, fromNote, toNote) {
            if (fromNote === undefined) fromNote = 0;
            if (toNote === undefined) toNote = song.tickables.length -1;
            var offset = 0;
            for (var i = fromNote; i <= toNote; i++){
                var tickable = song.tickables[i];
                var time = song.tempo / tickable.duration;
                (function (tickable, time, i) {
                    setTimeout(function () {
                        Player.playChord(tickable, time);
                        $(document).trigger('chordPlayed', i);
                    }, offset * 1000);
                })(tickable, time, i);
                offset += time;
            }
        }
    };

    return SongPlayer;
});