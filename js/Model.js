function Model(){
    this.notes = [];
}

Model.prototype.addNote = function(keys, duration){
    this.notes.push(new Vex.Flow.StaveNote({ keys: keys, duration: duration }));
};

Model.prototype.addBar = function(){
    this.notes.push(new Vex.Flow.BarNote());
};

OSTISMusic.Note = function (key, octave){
    this.key = key;
    this.octave = octave;

    this.toString = function(){
        return this.key + "/" + this.octave;
    }
};

function Chord(duration){
    this.notes = [];
    this.duration = duration;

    this.toString = function(){
        return ':' + this.duration + " " + this.notes.join('.');
    }
}