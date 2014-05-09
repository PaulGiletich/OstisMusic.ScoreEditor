define(function(require){
    "use strict";
    var Player = require('player');

    var SongPlayer = {

        play: function (song, fromNote, toNote) {
            var self = this;
            self.playingSequenceId = _.uniqueId();

            if (fromNote === undefined) fromNote = 0;
            if (toNote === undefined) toNote = song.tickables.length -1;
            var offset = 0;
            for (var i = fromNote; i <= toNote; i++){
                var tickable = song.tickables[i];
                var time = song.tempo / tickable.duration;
                (function (tickable, time, i, playingSequenceId) {
                    setTimeout(function () {
                        if(self.playingSequenceId != playingSequenceId) return;
                        Player.playChord(tickable, time);
                        $(document).trigger('chordPlayed', i);
                    }, offset * 1000);
                })(tickable, time, i, self.playingSequenceId);
                offset += time;
            }
        },

        stop: function() {
            this.playingSequenceId = null;
        }
    };

    return SongPlayer;
});