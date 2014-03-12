define('model', ['util'], function(Util){
    var Model = {};

    /**
     * @param {String} key
     * @param {Number} octave
     * @param {{flat: Boolean, sharp: Boolean}} opts
     * @constructor
     */
    Model.Note = function (key, octave, opts){
        this.key = key;
        this.octave = octave;
        if(opts){
            this.flat = opts['flat'];
            this.sharp = opts['sharp'];
        }
    };

    /**
     * @param {String} type
     * @constructor
     */
    Model.BarNote = function (type){
        var types = {
            "SINGLE": "|",
            "DOUBLE": "=||",
            "END"   : "=|=",
            "RBEGIN": "=|:",
            "REND"  : "=:|"
        };

        if(!type in types){
            throw "Incorrect bar type";
        }

        this.type = type;
    };

    /**
     * @param {Number} duration
     * @param {Model.Note[]} notes
     * @constructor
     */
    Model.Chord = function (duration, notes){
        this.duration = duration;
        this.notes = [];
        if(notes){
            this.notes = notes.slice();
        }
    };

    /**
     *
     * @param {Number} duration
     * @constructor
     */
    Model.Rest = function(duration){
        this.duration = duration;
    };


    /**
     * @param tickables
     * @constructor
     */
    Model.Song = function(tickables){
        this.tickables = tickables ? tickables : [];
    };

    /**
     * @param {Number} index
     */
    Model.Song.prototype.removeTickable = function(index){
        this.tickables.splice(index, 1);
    };

    /**
     * @param  {Number} index
     * @param tickable
     */
    Model.Song.prototype.insertTickable = function(index, tickable){
        Util.insertToArray(this.tickables, index, tickable);
    };

    /**
     * @param index
     * @returns {*}
     */
    Model.Song.prototype.getTickable = function(index){
        return this.tickables[index];
    };

    /**
     * Iterator by song tickables
     * @param {Function} callback
     */
    Model.Song.prototype.eachNote = function(callback){
        for(var i = 0; i < this.tickables.length; i++){
            callback(this.tickables[i], i);
        }
    };

    return Model;
});
