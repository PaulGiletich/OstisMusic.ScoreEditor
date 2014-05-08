define(function(require){
    "use strict";
    var Model = require('model');

    var Player = function(){
        var self = this;

        if(Player.prototype.instance) {
            return Player.prototype.instance;
        }
        Player.prototype.instance = self;

        MIDI.loadPlugin({
            soundfontUrl: "./soundfont/",
            instruments: ["acoustic_grand_piano", "synth_drum" ],
            callback: function () {
                $(document).trigger('playerReady');
            }
        });

        self.playChord = function(chord, duration, delay){
            if(chord instanceof Model.Rest) return;
            delay = delay ? delay : 0;
            self.startChord(chord, delay);
            self.endChord(chord, duration + delay);
        };

        self.startChord = function(chord, delay){
            var tones = _.map(chord.notes, function (note) {
                return MIDI.keyToNote[note.key + note.octave];
            });
            delay = delay ? delay : 0;
            try {
                MIDI.chordOn(0, tones, self.volume, delay);
            } catch(err) {
                console.log(err);
            }
        };

        self.endChord = function(chord, delay){
            var tones = _.map(chord.notes, function (note) {
                return MIDI.keyToNote[note.key + note.octave];
            });
            delay = delay ? delay : 0;
            try{
                MIDI.chordOff(0, tones, delay);
            }catch (err){
                console.log(err);
            }
        };

        self.startTone = function(key, octave, delay){
            delay = delay ? delay : 0;
            var noteValue = MIDI.keyToNote[key + octave];
            try {
                MIDI.noteOn(0, noteValue, self.volume, delay);
            } catch(err) {
                console.log(err);
            }
        };

        self.endTone = function(key, octave, delay){
            delay = delay ? delay : 0;
            var noteValue = MIDI.keyToNote[key + octave];
            try{
                MIDI.noteOff(0, noteValue, delay);
            }catch (err){
                console.log(err);
            }
        };
    };

    return new Player();
});