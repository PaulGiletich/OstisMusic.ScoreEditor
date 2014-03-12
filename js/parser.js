define(['model'], function(Model){
    "use strict";

    /**
     * Parser from app model to vextab
     * @param {View} view - we need view here to access it's width and notesPerLine options
     * @constructor
     */
    var Parser = function (view){

        /**
         * @param {Song} song
         * @returns {string}
         */
        this.parse = function(song){
            var result = "";

            var fillness = 0;
            var staveTickables = [];
            song.eachNote(function(tickable, index){
                if(tickable instanceof Model.BarNote){
                    staveTickables.push(tickable.toString());
                }
                if(tickable instanceof Model.Chord){
                    staveTickables.push(parseChord(tickable));
                    fillness += 1/tickable.duration;
                }
                if(tickable instanceof Model.Rest){
                    staveTickables.push(parseRestChord(tickable));
                    fillness += 1/tickable.duration;
                }

                if(staveTickables.length == view.notesPerLine && index != song.tickables.length-1){
                    result += makeStave(staveTickables, view.getWidth());
                    staveTickables = [];
                }
            });
            result += makeStave(staveTickables, view.getWidth() * ((staveTickables.length+1)/(view.notesPerLine+1)));
            return result;
        };

        function makeStave(staveNotes, width){
            var result = " \n\n options " +
                "player=true" +
                " width=" + width;
            result += " \n tabstave notation=true clef=none tablature=false \n voice";

            if(staveNotes.length > 0){
                result += " \n notes ";
                result += staveNotes.join(" ");
            }
            return result;
        }

        function parseChord(chord){
            var result = ":" + chord.duration + " ";

            var notes = [];
            for(var ni = 0; ni < chord.notes.length; ni++){
                var note = chord.notes[ni];
                notes.push(parseNote(note));
            }

            if(notes.length > 1){
                result += "(" + notes.join(".") + ")";
            }
            else {
                result += notes[0];
            }
            return result;
        }

        function parseNote(note){
            var result = "";
            result += note.key;
            if(note.sharp){
                result += "#";
            }
            if(note.flat){
                result += "@";
            }
            result += "/" + note.octave;
            return result;
        }

        function parseRestChord(chord){
            return ":" + chord.duration + " ##";
        }
    };

    return Parser;
});

