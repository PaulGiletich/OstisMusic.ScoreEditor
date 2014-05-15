define(function(){
    "use strict";

    var JsonSerializer = {};

    JsonSerializer.serialize = function(song){
        return JSON.stringify(song, null, '\t');
    };

    JsonSerializer.deserialize = function(text){
        JSON.parse(text, tickablesReviver);
    };

    return JsonSerializer;

    function tickablesReviver(key, value) {
        if(value.hasOwnProperty('key')
            && value.hasOwnProperty('octave')
            && value.hasOwnProperty('sharp')
            && value.hasOwnProperty('flat')){
            return new OSTISMusic.Note(value.key, value.octave, value);
        }
        if(value.hasOwnProperty('type')){//TODO consider better parsing
            return new OSTISMusic.BarNote(value.type)
        }
        if(value.hasOwnProperty('tickables')){
            return new OSTISMusic.Track(value.tickables);
        }
        if (value.hasOwnProperty('notes')
            && value.hasOwnProperty('duration')) {
            return new OSTISMusic.Chord(value.duration, value.notes);
        }
        if(value.hasOwnProperty('duration')
            && ! value.hasOwnProperty('notes')){
            return new OSTISMusic.Rest(value.duration);
        }
        return value;
    }


});