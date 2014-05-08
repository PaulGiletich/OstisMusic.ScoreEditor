define(function(require){
    // This is simply namespace for mass including.
    //      can't wait for ES6 modules :(

    return {
        Note    :   require('model/note'),
        Chord   :   require('model/chord'),
        BarNote :   require('model/bar-note'),
        Rest    :   require('model/rest'),
        Song    :   require('model/song'),
        Track   :   require('model/track')
    };
});
