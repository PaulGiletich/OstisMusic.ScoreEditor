define(function(require){
    // This is simply namespace for mass including.
    //      can't wait for ES6 modules :(

    return {
        Note    :   require('scripts/model/note'),
        Chord   :   require('scripts/model/chord'),
        BarNote :   require('scripts/model/bar-note'),
        Bar     :   require('scripts/model/bar'),
        TimeSignature:   require('scripts/model/time-signature'),
        Rest    :   require('scripts/model/rest'),
        Song    :   require('scripts/model/song'),
        Instrument:   require('scripts/model/instrument'),
        Track   :   require('es6!scripts/model/track')
    };
});
