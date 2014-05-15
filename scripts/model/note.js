define(function(require){

    var Note = function (key, octave, opts){
        this.key = key;
        this.octave = octave;
        if(opts){
            this.flat = opts['flat'];
            this.sharp = opts['sharp'];
        }
    };

    return Note;
});
