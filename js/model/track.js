define(function(require){
    var Util = require('util');

    var Track = function(tickables, tempo, instrument){
        this.tickables = tickables ? tickables : [];
        this.tempo = tempo;
        this.instrument = instrument;
    };

    Track.prototype.removeTickable = function(index){
        this.tickables.splice(index, 1);
    };

    Track.prototype.insertTickable = function(index, tickable){
        Util.insertToArray(this.tickables, index, tickable);
    };

    Track.prototype.getTickable = function(index){
        return this.tickables[index];
    };

    Track.prototype.eachNote = function(callback){
        for(var i = 0; i < this.tickables.length; i++){
            callback(this.tickables[i], i);
        }
    };

    return Track;
});
