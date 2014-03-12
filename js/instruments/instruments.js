define(['instruments/note-creation-instrument', 'instruments/rest-creation-instrument'],
    function(NoteCreationInstrument, RestCreationInstrument){
    "use strict";

    return {
        NoteCreationInstrument: NoteCreationInstrument,
        RestCreationInstrument: RestCreationInstrument
    }
});