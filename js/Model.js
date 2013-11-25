OSTISMusic.Note = function (key, octave){
    this.key = key;
    this.octave = octave;

    this.toString = function(){
        return this.key + "/" + this.octave;
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

OSTISMusic.Voice = function(chords){
    this.chords = [];
    if(chords){
        this.chords = chords.slice();
    }

    this.toString = function(){
        return "voice\n\tnotes " + this.chords.join(' ');
    }
};

OSTISMusic.Song = function(){
    this.voices = [];

    this.toString = function(){
        return "tabstave notation=true tablature=false\n" + this.voices.join('\n');// there will be many tabstaves
    }
};