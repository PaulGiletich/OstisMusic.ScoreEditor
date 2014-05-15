define(function(require){
    var Player = require('player');

    var playingSequenceId = null;

    var SongPlayer = {

        play: function (song, fromNote = {indexInTrack: 0}, toNote = {indexInTrack: Infinity}, singleTrack = false) {

            var playingSeqId = playingSequenceId = _.uniqueId();

            for(var track of song.tracks){
                if(singleTrack && track != fromNote.track) continue;

                var overallDelay = 0;
                for(var ti of track.tickableIterator()){
                    if(ti.indexInTrack < fromNote.indexInTrack) continue;
                    if(ti.indexInTrack > toNote.indexInTrack) return;

                    var duration = (240 / song.tempo) / ti.tickable.duration;

                    schedulePlaying(overallDelay, duration, ti, playingSeqId);

                    overallDelay += duration;
                }
            }
        },

        stop: function() {
            playingSequenceId = null;
        },

        updateInstruments: function (song) {
            var instruments = _.map(song.tracks, function (track) {
                return track.instrument;
            });
            if(_.difference(instruments, Player.loadedInstruments).length){
                Player.loadInstruments(instruments);
            }
        }
    };

    function schedulePlaying(delay, duration, ti, playingSeqId){
        setTimeout(() => {
            if(playingSeqId != playingSequenceId) return;
            var options = ti.track.options;

            Player.setInstrument(ti.track.instrument);
            Player.playChord(ti.tickable, duration, options);
            $(document).trigger('chordPlayed', ti);
        }, delay * 1000);
    }

    return SongPlayer;
});