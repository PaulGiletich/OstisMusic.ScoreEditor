define(function(require){

    var Chord = function (duration, notes){
        this.duration = duration;
        this.notes = [];
        if(notes){
            this.notes = notes.slice();
        }
    };

    return Chord;
});
