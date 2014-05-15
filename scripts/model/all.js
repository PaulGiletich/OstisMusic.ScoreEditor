define(function(require){
    // This is simply namespace for mass including.
    //      can't wait for ES6 modules :(

    return {
        Note    :   require('model/note'),
        Chord   :   require('model/chord'),
        BarNote :   require('model/bar-note'),
        Bar     :   require('model/bar'),
        TimeSignature:   require('model/time-signature'),
        Rest    :   require('model/rest'),
        Song    :   require('model/song'),
        Instrument:   require('model/instrument'),
        Track   :   require('es6!model/track')
    };
});
