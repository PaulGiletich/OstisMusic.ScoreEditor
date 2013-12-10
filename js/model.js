OSTISMusic.Note = function (key, octave, opts){
    this.key = key;
    this.octave = octave;
    if(opts){
        this.flat = opts['flat'] ? opts.flat : false;
        this.sharp = opts['sharp'] ? opts.sharp : false;
    }
};

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

    this.prototype.toString = function(){
        return types[this.type];
    }
};

OSTISMusic.Chord = function (duration, notes){
    this.duration = duration;
    this.notes = [];
    if(notes){
        this.notes = notes.slice();
    }
};

OSTISMusic.RestChord = function(duration){
    this.duration = duration;
};


OSTISMusic.Song = function(tickables){
    this.tickables = tickables ? tickables : [];
};

OSTISMusic.Song.prototype.removeTickable = function(index){
    this.tickables.splice(index, 1);
};

OSTISMusic.Song.prototype.insertTickable = function(index, tickable){
    OSTISMusic.Util.insertToArray(this.tickables, index, tickable);
};

OSTISMusic.Song.prototype.getTickable = function(index){
    return this.tickables[index];
};

OSTISMusic.Song.prototype.eachNote = function(callback){
    for(var i = 0; i < this.tickables.length; i++){
        callback(this.tickables[i], i);
    }
};