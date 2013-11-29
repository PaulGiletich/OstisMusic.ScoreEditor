OSTISMusic.Note = function (key, octave){
    this.key = key;
    this.octave = octave;

    this.toString = function(){
        return this.key + "/" + this.octave;
    }
};

OSTISMusic.BarNote = function (type){
    var types = {
        "SINGLE": "|",
        "DOUBLE": "=||",
        "END"   : "=|="
    };

    if(!type in types){
        throw "Incorrect bar type";
    }

    this.type = type;

    this.toString = function(){
        return types[this.type];
    }
};

OSTISMusic.Chord = function (duration, notes){
    this.notes = [];
    if(notes){
        this.notes = notes.slice();
    }
    this.duration = duration;

    this.toString = function(){
        var result = ':' + this.duration + " ";
        if(this.notes.length > 1){
            result += "(" + this.notes.join('.') + ")";
        }
        else {
            result += this.notes[0];
        }
        return  result;
    }
};

OSTISMusic.Song = function(tickables){
    this.tickables = tickables ? tickables : [];

    this.getTickable = function(index){
        return this.tickables[index];
    }
};