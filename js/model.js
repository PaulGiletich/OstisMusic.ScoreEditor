/**
 * @param {String} key
 * @param {Number} octave
 * @param {{flat: Boolean, sharp: Boolean}} opts
 * @constructor
 */
OSTISMusic.Note = function (key, octave, opts){
    this.key = key;
    this.octave = octave;
    if(opts){
        this.flat = opts['flat'] ? opts.flat : false;
        this.sharp = opts['sharp'] ? opts.sharp : false;
    }
};

/**
 * @param {String} type
 * @constructor
 */
OSTISMusic.BarNote = function (type){
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
 * @param {OSTISMusic.Note[]} notes
 * @constructor
 */
OSTISMusic.Chord = function (duration, notes){
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
OSTISMusic.Rest = function(duration){
    this.duration = duration;
};


/**
 * @param tickables
 * @constructor
 */
OSTISMusic.Song = function(tickables){
    this.tickables = tickables ? tickables : [];
};

/**
 * @param {Number} index
 */
OSTISMusic.Song.prototype.removeTickable = function(index){
    this.tickables.splice(index, 1);
};

/**
 * @param  {Number} index
 * @param tickable
 */
OSTISMusic.Song.prototype.insertTickable = function(index, tickable){
    OSTISMusic.Util.insertToArray(this.tickables, index, tickable);
};

/**
 * @param index
 * @returns {*}
 */
OSTISMusic.Song.prototype.getTickable = function(index){
    return this.tickables[index];
};

/**
 * Iterator by song tickables
 * @param {Function} callback
 */
OSTISMusic.Song.prototype.eachNote = function(callback){
    for(var i = 0; i < this.tickables.length; i++){
        callback(this.tickables[i], i);
    }
};