define(function(require){
    var Model = require('model/all');

    var Player = function(){
        var self = this;
        self.channel = 0;
        self.loadedInstruments = [];

        if(Player.prototype.instance) {
            return Player.prototype.instance;
        }
        Player.prototype.instance = self;

        self.playChord = function(chord, duration, options){
            if(chord instanceof Model.Rest) return;
            self.startChord(chord, options);
            self.endChord(chord, duration, options);
        };

        function getTones(chord, options) {
            if(chord instanceof Array){
                return _.map(chord, function(tone){
                    if (options.octaveShift) {
                        tone += options.octaveShift * 12;
                    }
                    return tone;
                });
            }
            return _.map(chord.notes, function (note) {
                var tone = MIDI.keyToNote[note.key + note.octave];
                if (options.octaveShift) {
                    tone += options.octaveShift * 12;
                }
                return tone;
            });
        }

        self.startChord = function(chord, options){
            var tones = getTones(chord, options);
            try {
                MIDI.chordOn(self.channel, tones, self.volume, 0);
            } catch(err) {
                console.log(err);
            }
        };

        self.endChord = function(chord, duration, options){
            var tones = getTones(chord, options);
            try{
                MIDI.chordOff(self.channel, tones, duration);
            }catch (err){
                console.log(err);
            }
        };

        self.startTone = function(key, octave, delay, options){
            delay = delay ? delay : 0;
            var noteValue;
            if(typeof key === 'number'){
                noteValue = key;
            } else {
                noteValue = MIDI.keyToNote[key + octave];
            }
            try {
                MIDI.noteOn(self.channel, noteValue, self.volume, delay);
            } catch(err) {
                console.log(err);
            }
        };

        self.endTone = function(key, octave, delay, options){
            delay = delay ? delay : 0;
            var noteValue = MIDI.keyToNote[key + octave];
            try{
                MIDI.noteOff(self.channel, noteValue, delay);
            }catch (err){
                console.log(err);
            }
        };

        self.setInstrument = function(instr){
            self.channel = self.loadedInstruments.indexOf(instr);
        };

        self.loadInstruments = function(instruments){
            $(document).trigger('playerLoading');
            var instrumentNames = _.map(instruments, function(instr){
                return instr.id;
            });
            MIDI.loadPlugin({
                soundfontUrl: "./soundfont/",
                instruments: instrumentNames,
                callback: function () {
                    self.loadedInstruments = instruments;
                    _.each(instruments, function(instrument, index) {
                        MIDI.programChange(index, instrument.number)
                    });
                    $(document).trigger('playerReady');
                }
            });
        }
    };

    return new Player();
});