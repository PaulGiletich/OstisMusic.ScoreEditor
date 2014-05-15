define(function (require) {

    var Instrument = function(arg){
        var instr = null;
        if (typeof arg === "string"){
            instr = _.find(Instrument.getAllInstruments(), function(i){
                return i.id == arg || i.instrument == arg;
            });
        }
        if (typeof arg == "number"){
            instr = _.find(Instrument.getAllInstruments(), {number: arg});
        }
        if (!instr) throw 'Instrument not found';
        return instr;
    };

    Instrument.getAllInstruments = function(){
        return MIDI.GeneralMIDI.byId;
    };

    return Instrument;
});