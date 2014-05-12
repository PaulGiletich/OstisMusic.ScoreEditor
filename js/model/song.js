define(function(require){

    var Song = function (tracks, tempo) {
        this.tracks = tracks ? tracks : [];
        this.tempo = tempo ? tempo : 120;
    };

    return Song;
});
