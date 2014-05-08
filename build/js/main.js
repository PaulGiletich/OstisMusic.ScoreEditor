
define('util',{
    contains: function contains(rect, point){
        return (rect.x < point.x  &&
            rect.y < point.y &&
            rect.x + rect.w > point.x &&
            rect.y + rect.h > point.y);
    },

    enlarge: function enlarge(rect, amount){
        return {x: rect.x - amount,
            y: rect.y - amount,
            w: rect.w + amount*2,
            h: rect.h + amount*2};
    },

    insertToArray: function(arr, index, item){
        arr = arr.splice(index, 0, item);
    },

    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    keyboardNotes: ['C', 'Db', 'D', 'Eb', "E", 'F', "Gb", 'G', 'Ab', 'A', 'Bb', 'B'],
    keyboardKeys: 'zsxdcvgbhnjmq2w3er5t6y7ui9o0p[=]'.split(''),


    getKeyByNumber: function getKeyByNumber(number){
        return this.notes[number];
    },

    getNoteNumberByKey: function getNoteNumberByKey(key){
        return this.notes.indexOf(key);
    },

    saveFile: function (filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        pom.click();
    }

});
define('model', ['util'], function(Util){
    var Model = {};

    /**
     * @param {String} key
     * @param {Number} octave
     * @param {{flat: Boolean, sharp: Boolean}} opts
     * @constructor
     */
    Model.Note = function (key, octave, opts){
        this.key = key;
        this.octave = octave;
        if(opts){
            this.flat = opts['flat'];
            this.sharp = opts['sharp'];
        }
    };

    /**
     * @param {String} type
     * @constructor
     */
    Model.BarNote = function (type){
        var types = {
            "SINGLE": "|",
            "DOUBLE": "=||",
            "END"   : "=|=",
            "RBEGIN": "=|:",
            "REND"  : "=:|"
        };

        if(!type in types){
            throw "Incorrect bar type";
        }

        this.type = type;
    };

    /**
     * @param {Number} duration
     * @param {Model.Note[]} notes
     * @constructor
     */
    Model.Chord = function (duration, notes){
        this.duration = duration;
        this.notes = [];
        if(notes){
            this.notes = notes.slice();
        }
    };

    /**
     *
     * @param {Number} duration
     * @constructor
     */
    Model.Rest = function(duration){
        this.duration = duration;
    };


    /**
     * @param tickables
     * @constructor
     */
    Model.Track = function(tickables, tempo){
        this.tickables = tickables ? tickables : [];
        this.tempo = tempo;
    };

    /**
     * @param {Number} index
     */
    Model.Track.prototype.removeTickable = function(index){
        this.tickables.splice(index, 1);
    };

    /**
     * @param  {Number} index
     * @param tickable
     */
    Model.Track.prototype.insertTickable = function(index, tickable){
        Util.insertToArray(this.tickables, index, tickable);
    };

    /**
     * @param index
     * @returns {*}
     */
    Model.Track.prototype.getTickable = function(index){
        return this.tickables[index];
    };

    /**
     * Iterator by song tickables
     * @param {Function} callback
     */
    Model.Track.prototype.eachNote = function(callback){
        for(var i = 0; i < this.tickables.length; i++){
            callback(this.tickables[i], i);
        }
    };

    return Model;
});

define('canvas-extensions',[],function(){
    

    /**
     * transforms event point coordinates relative to canvas
     * @param event {event}
     * @returns {{x: number, y: number}}
     */
    HTMLCanvasElement.prototype.relMouseCoords = function (event){
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = this;

        do{
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while(currentElement = currentElement.offsetParent);

        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;

        return {x:canvasX, y:canvasY}
    };

    /**
     * helper method to draw a rounded rect on canvas
     * @param x
     * @param y
     * @param width
     * @param height
     * @param outerRect
     * @param radius
     * @param fill
     * @param stroke
     */
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, outerRect, radius, fill, stroke) {
        if (typeof outerRect == "undefined"){
            outerRect = false;
        }
        if (typeof fill == "undefined" ) {
            fill = true;
        }
        if (typeof stroke == "undefined" ) {
            stroke = false;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }

        if(outerRect){
            x -= radius;
            y -= radius;
            width += radius * 2;
            height += radius * 2;
        }
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
        if (stroke) {
            this.stroke();
        }
        if (fill) {
            this.fill();
        }
    };

});
define('view',['util', 'model', 'canvas-extensions'],
function(Util, Model){

    /**
     * @constructor
     */
    var View = function (){
        var self = this;
        var canvas = $("#canvas")[0]; canvas.width = $(".canvas-layers").innerWidth() - 100;
        var hoverCanvas = $("#hoverCanvas")[0];
        var selectionCanvas = $("#selectionCanvas")[0];

        var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
        var selectedNote = null;

        self.artist = new Vex.Flow.Artist(0, 0, window.innerWidth); Vex.Flow.Artist.NOLOGO = true;
        self.notesPerLine = 8;

        /**
         * re-render view
         */
        this.update = function(){
            self.artist.render(renderer);
            hoverCanvas.width = selectionCanvas.width = canvas.width;
            hoverCanvas.height = selectionCanvas.height  = canvas.height;
            drawSelection();
        };

        /**
         * transforms event to local coordinated
         * @param event
         * @returns {}
         */
        this.toLocalCoords = function(event){
            return canvas.relMouseCoords(event);
        };

        /**
         * iterator by each note of view. if you done with it, return true in callback, so it will not iterate more
         * @param {Function} callback
         */
        this.eachNote = function(callback){
            var curr_i = -1;

            for (var si = 0; si < self.artist.staves.length; si++){
                var stave = self.artist.staves[si];

                for (var vi = 0; vi < stave.note_voices.length; vi++){
                    var voice = stave.note_voices[vi];

                    for (var ni = 0; ni < voice.length; ni++){
                        var note = voice[ni];

                        curr_i++;
                        var isEnough = callback(note, curr_i);
                        if (isEnough) {
                            return;
                        }
                    }
                }
            }
        };

        /**
         * find note at specified position
         * @param {{x: Number, y: Number}} point
         * @returns {{index: Number, view: Vex.Flow.StaveNote}}
         */
        this.findNote = function(point){
            var contains = Util.contains;
            var enlarge = Util.enlarge;

            var result = null;
            this.eachNote(function(note, index){
                if(contains(enlarge(note.getBoundingBox(), 8), point)){
                    result = {index: index, view: note};
                    return true;
                }
                return false;
            });
            return result;
        };

        /**
         * find previous note by specified position
         * @param {{x: Number, y: Number}} point
         * @returns {{index: Number, view: Vex.Flow.StaveNote}}
         */
        this.findPreviousNote = function(point){
            var stave = this.findStave(point);
            if(!stave) return null;

            var result = null;
            this.eachNote(function(note, index){
                if (note.getStave() == stave.note && note.getAbsoluteX() > point.x) {
                    return true;
                }
                //this happens in the end of line, next note x is not greater, but note is actually previous
                if (result && result.view.getStave() == stave.note && note.getStave() != stave.note) {
                    return true;
                }
                //this happens at the start, when there is no previous note
                if(note.getStave() == stave.note && index == 0 && note.getAbsoluteX() > point.x){
                    result = {index: -1};
                    return true;
                }
                result =  {index: index, view: note};
                return false;
            });
            return result;
        };

        /**
         * find stave containing specified point
         * @param {{x: Number, y: Number}} point
         * @returns {Vex.Flow.Stave}
         */
        this.findStave = function(point){
            var contains = Util.contains;

            for (var i = 0; i < self.artist.staves.length; i++){
                var stave = self.artist.staves[i];
                var boundingBox = stave.note.getBoundingBox();
                boundingBox.h -= 20;
                if(contains(boundingBox, point)){
                    return stave;
                }
            }
            return null;
        };

        /**
         * get new note object by point on stave
         * @param {{x: Number, y: Number}} point
         * @returns {OSTISMusic.Note}
         */
        this.getNewNoteByPos = function(point){
            var stave = this.findStave(point).note;

            // spacing between two neighbour notes
            var spacing = stave.options.spacing_between_lines_px / 2;

            // starting from -5th stave line
            // presenting current note as digit: note = key + octave * notes per octave(7)
            // note at -5th line - C/7
            var note = Util.getNoteNumberByKey('C') + 7*7;

            for(var i = stave.getYForLine(-5); i < stave.getYForLine(15); i += spacing, note--){
                if(point.y < i){
                    //if we reach y pos, convert digit note to model representation and return result
                    return new Model.Note(Util.getKeyByNumber(note % 7), Math.floor(note/7));
                }
            }
            return null;
        };

        /**
         * draws phantom note at point
         * @param {{x: Number, y: Number}} point
         */
        this.phantomNote = function(point){
            var ctx=hoverCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalAlpha = 0.5;
            ctx.fillStyle="#000000";
            ctx.roundRect(point.x,point.y,
                0,0, true, 5);
        };

        /**
         * draws phantom rest at specified point
         * @param {{x: Number, y: Number}} p
         */
        this.phantomRest = function(p){
            var ctx=hoverCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalAlpha = 0.5;
            ctx.fillStyle="#000000";

            var stave = self.findStave(p).note;
            ctx.roundRect(p.x,stave.getYForLine(1),
                0,stave.getYForLine(3) - stave.getYForLine(1), true, 5);
        };

        /**
         * highlights specified note
         * @param {Vex.Flow.StaveNote} note
         */
        this.highlightNote = function(note){
            var ctx=hoverCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            if(!note) return;

            var rect = note.getBoundingBox();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle="#0000FF";
            ctx.roundRect(rect.x,rect.y,
                rect.w,rect.h, true, 6);
        };

        /**
         * function called when note is playing
         * @param {{index: Number, view: Vex.Flow.StaveNote}} note
         */
        this.playingNote = function(note){
            this.setSelectedNote(note.index);//TODO proper playing note indication
        };

        /**
         *
         * @param {Number} index
         */
        this.setSelectedNote = function(index){
            if (index < 0) return;
            if (this.getTickable(index) == null) {
                this.setSelectedNote(index-1);
                return;
            }
            selectedNote = index;
            drawSelection();
        };

        /**
         * @returns {Number}
         */
        this.getSelectedNote = function(){
            return selectedNote;
        };

        /**
         * @returns {Number}
         */
        this.getWidth = function(){
            return canvas.width;
        };

        /**
         * @param {Number} width
         */
        this.setWidth = function(width){
            canvas.width = width;
            this.update();
        };

        /**
         * @param {Number} index
         * @returns {Vex.Flow.Tickable}
         */
        this.getTickable = function(index){
            var result = null;
            this.eachNote(function(note, i){
                if(i == index){
                    result = {index: i, view: note};
                    return true;
                }
                return false;
            });
            return result;
        };

        /**
         * draws current selection highlight
         */
        function drawSelection(){
            var ctx = selectionCanvas.getContext("2d");
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if(selectedNote != null){
                var rect = self.getTickable(selectedNote).view.getBoundingBox();
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = "#0000FF";
                ctx.roundRect(rect.x, rect.y,
                    rect.w, rect.h, true, 6);
            }
        }

    };

    return View;
});


define('player',['require','model'],function(require){
    
    var Model = require('model');

    var Player = function(){
        var self = this;

        if(Player.prototype.instance) {
            return Player.prototype.instance;
        }
        Player.prototype.instance = self;

        var volume = 127;

        MIDI.loadPlugin({
            soundfontUrl: "./soundfont/",
            instrument: "acoustic_grand_piano",
            callback: function () {
                $(document).trigger('playerReady');
            }
        });

        self.playChord = function(chord, duration, delay){
            if(chord instanceof Model.Rest) return;
            delay = delay ? delay : 0;
            for(var i = 0; i < chord.notes.length; i++){
                var key = chord.notes[i].key,
                    octave = chord.notes[i].octave;
                self.startTone(key, octave, delay);
                self.endTone(key, octave, duration + delay);
            }
        };
//
//        self.startTone = function(key, octave, delay){
//            delay = delay ? delay : 0;
//            var noteValue = MIDI.keyToNote[key + octave];
//            try {
//                MIDI.noteOn(0, noteValue, self.volume, delay);
//            } catch(err) {
//                //aha
//            }
//        };
//
//        self.endTone = function(key, octave, delay){
//            delay = delay ? delay : 0;
//            var noteValue = MIDI.keyToNote[key + octave];
//            try{
//                MIDI.noteOff(0, noteValue, delay);
//            }catch (err){
//                //fuck MIDI
//            }
//        };
    };

    return new Player();
});
define('song-player',['require','player'],function(require){
    
    var Player = require('player');

    var SongPlayer = {
        play: function (song, fromNote, toNote) {
            if (fromNote === undefined) fromNote = 0;
            if (toNote === undefined) toNote = song.tickables.length -1;
            var offset = 0;
            for (var i = fromNote; i <= toNote; i++){
                var tickable = song.tickables[i];
                var time = song.tempo / tickable.duration;
                (function (tickable, time, i) {
                    setTimeout(function () {
                        Player.playChord(tickable, time);
                        $(document).trigger('chordPlayed', i);
                    }, offset * 1000);
                })(tickable, time, i);
                offset += time;
            }
        }
    };

    return SongPlayer;
});
define('parser',['model'], function(Model){
    

    /**
     * Parser from app model to vextab
     * @param {View} view - we need view here to access it's width and notesPerLine options
     * @constructor
     */
    var Parser = function (view){

        /**
         * @param {Track} song
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


define('instruments/note-creation-instrument',['model', 'song-player'], function(Model, SongPlayer){
    

    var NoteCreationInstrument = function(editor){

        this.scoreClick = function(e){
            var coords = editor.view.toLocalCoords(e);
            var note = editor.view.findNote(coords);
            if(note){
                noteClicked(note);
                return;
            }
            var lastNote = editor.view.findPreviousNote(coords);
            if(lastNote){
                addNote(coords);
            }
        };

        this.mouseMove = function(e){
            var coords = editor.view.toLocalCoords(e);
            var note = editor.view.findNote(coords);
            var prevNote = editor.view.findPreviousNote(coords);
            if(note){
                editor.view.highlightNote(note.view);
            }
            else if (prevNote){
                coords.y = coords.y - coords.y % 5;
                coords.x = prevNote.view.getAbsoluteX() + prevNote.view.getBoundingBox().w + 15;
                editor.view.phantomNote(coords);
            }
        };

        function noteClicked(note){
            $(document).trigger('playChord', note.index);
            editor.view.setSelectedNote(note.index);
        }

        function addNote(point){
            var prevNote = editor.view.findPreviousNote(point);
            var note = editor.view.getNewNoteByPos(point);
            var chord = new Model.Chord(editor.newNoteDuration, [note]);
            editor.song.insertTickable(prevNote.index+1, chord);
            editor.update();
            editor.view.setSelectedNote(prevNote.index+1);
        }
    };

    return NoteCreationInstrument;
});


define('instruments/rest-creation-instrument',['model', 'song-player'], function(Model, SongPlayer){
    

    var RestCreationInstrument = function(editor){

        this.scoreClick = function(e){
            var coords = editor.view.toLocalCoords(e);
            var note = editor.view.findNote(coords);
            if(note){
                noteClicked(note);
                return;
            }
            var lastNote = editor.view.findPreviousNote(coords);
            if(lastNote){
                addRest(coords);
            }
        };

        this.mouseMove = function(e){
            var coords = editor.view.toLocalCoords(e);
            var note = editor.view.findNote(coords);
            var prevNote = editor.view.findPreviousNote(coords);
            if(note){
                editor.view.highlightNote(note.view);
            }
            else if (prevNote){
                var x = prevNote.view.getAbsoluteX() + prevNote.view.getBoundingBox().w + 15;
                var y = coords.y;
                editor.view.phantomRest({x:x, y:y});
            }
        };

        function noteClicked(note){
            $(document).trigger('playChord', note.index);
            editor.view.setSelectedNote(note.index);
        }

        function addRest(point){
            var prevNote = editor.view.findPreviousNote(point);
            var tickable = new Model.Rest(editor.newNoteDuration);
            editor.song.insertTickable(prevNote.index+1, tickable);
            editor.update();
            editor.view.setSelectedNote(prevNote.index+1);
        }
    };

    return RestCreationInstrument;
});
define('instruments/instruments',['instruments/note-creation-instrument', 'instruments/rest-creation-instrument'],
    function(NoteCreationInstrument, RestCreationInstrument){
    

    return {
        NoteCreationInstrument: NoteCreationInstrument,
        RestCreationInstrument: RestCreationInstrument
    }
});
define('serializer/json-serializer',[],function(){
    

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
define('editor',['model', 'view', 'song-player', 'util', 'parser', 'instruments/instruments', 'serializer/json-serializer'],
function(Model, View, SongPlayer, Util, Parser, Instruments, Serializer){
        

    // This is fucking hell.
    var Editor = function (){

        var self = this;
        this.song = new Model.Track();
        this.view = new View();
        var vextab = new Vex.Flow.VexTab(this.view.artist);
        var parser = new Parser(this.view);
        this.player = SongPlayer;
        this.newNoteDuration = $('.durations .active').attr("value");
        this.selectedInstrument = new Instruments.NoteCreationInstrument(this);

        init();

        function init(){
            initScore();
            initButtons();
            initHotkeys();
            initEvents();
        }

        /**
         * Reparse song and update scene
         */
        this.update = function(){
            try {
                vextab.reset();
                self.view.artist.reset();
                vextab.parse(parser.parse(self.song));
                self.view.update();
                $(".error").text("");
            } catch (e) {
                console.log(e);
                console.log(e.message);
                $(".error").text(e.message);
            }
        };

        function initScore(){
            $('.canvas-layers')
                .click(function(e) {
                    self.selectedInstrument.scoreClick(e);
                })
                .mousemove(function(e) {
                    self.selectedInstrument.mouseMove(e);
                });

            $(document).bind('songChanged', function(){
                self.update();
            });

            window.addEventListener('resize', function () {
                self.view.setWidth($(".canvas-layers").innerWidth() - 100);
                self.update();
            });
        }

        function initButtons(){

            $('.durations .item')
                .click(function(event){
                    $('.durations .item').removeClass("active");
                    $(event.target).addClass('active');
                    self.newNoteDuration = event.target.getAttribute("value");
                    self.song.getTickable(self.view.getSelectedNote()).duration = self.newNoteDuration;
                    $.event.trigger('songChanged');
                });

            $('.play').click(function(){
                self.player.play(self.song);
            });

            $('.stop').click(function(){
                self.player.stop();
            });

            $('.accidental-sharp').click(function setNoteSharp(){
                var chord = self.song.getTickable(self.view.getSelectedNote());
                chord.notes[0].flat = false;
                chord.notes[0].sharp = true;//TODO: change when making editable chords
                $.event.trigger('songChanged');
                self.player.playNote([self.view.getTickable(self.view.getSelectedNote()).view]);
            });
            $('.accidental-flat').click(function setNoteFlat(){
                var chord = self.song.getTickable(self.view.getSelectedNote());
                chord.notes[0].flat = true;
                chord.notes[0].sharp = false;
                $.event.trigger('songChanged');
                self.player.playNote([self.view.getTickable(self.view.getSelectedNote()).view]);
            });
            $('.accidental-none').click(function setNoteDefault(){
                var chord = self.song.getTickable(self.view.getSelectedNote());
                chord.notes[0].flat = false;
                chord.notes[0].sharp = false;
                $.event.trigger('songChanged');
                self.player.playNote([self.view.getTickable(self.view.getSelectedNote()).view]);
            });

            $('.tickable.note').click(function(event){
                $('.tickables .tickable').removeClass('active');
                $(event.target).addClass('active');
                self.selectedInstrument = new Instruments.NoteCreationInstrument(self);
            });

            $('.tickable.rest').click(function(event){
                $('.tickables .tickable').removeClass('active');
                $(event.target).addClass('active');
                self.selectedInstrument = new Instruments.RestCreationInstrument(self);
            });

            $(".save").click(function(){
                Util.saveFile('song.json', Serializer.serialize(self.song));
            });
            $(".open").click(function(ev){
                $("#hiddenFileInput")
                    .click()
                    .bind('change', function(){
                        var reader = new FileReader();
                        reader.onload = function(e){
                            self.song = Serializer.deserialize(e.target.result);
                            $.event.trigger('songChanged');
                        };
                        reader.readAsText($("#hiddenFileInput")[0].files[0]);
                    });
            });

            $(document).on('playerReady', function () {
                console.log('player ready');
                $('.player-control').removeClass('disabled');
            });
        }

        function initHotkeys(){

            $(document).bind('keydown', 'del', function(){
                self.song.removeTickable(self.view.getSelectedNote());
                $.event.trigger('songChanged');
            });

            $(document).bind('keydown', 'left', function(){
                self.view.setSelectedNote(self.view.getSelectedNote()-1);
            });

            $(document).bind('keydown', 'right', function(){
                self.view.setSelectedNote(self.view.getSelectedNote()+1);
            });

            $(document).bind('keydown', 'ctrl+up', function(e){
                e.preventDefault();
                var chord = self.song.getTickable(self.view.getSelectedNote());//TODO change when making editable chords
                for(var i = 0; i < chord.notes.length; i++){
                    var note = chord.notes[i];
                    var newKey = Util.getNoteNumberByKey(note.key) + 1;
                    if(newKey < 7){
                        note.key = Util.getKeyByNumber(newKey);
                    }
                    else {
                        note.octave++;
                        note.key = Util.getKeyByNumber(newKey % 7);
                    }
                }
                $.event.trigger('songChanged');
                self.player.playNote([self.view.getTickable(self.view.getSelectedNote()).view]);
            });

            $(document).bind('keydown', 'ctrl+down', function(e){
                e.preventDefault();
                var chord = self.song.getTickable(self.view.getSelectedNote());//TODO change when making editable chords
                for(var i = 0; i < chord.notes.length; i++){
                    var note = chord.notes[i];
                    var newKey = Util.getNoteNumberByKey(note.key) - 1;
                    if(newKey >= 0){
                        note.key = Util.getKeyByNumber(newKey);
                    }
                    else {
                        note.octave--;
                        note.key = Util.getKeyByNumber(7 + newKey % 7);
                    }
                }
                $.event.trigger('songChanged');
                self.player.playNote([self.view.getTickable(self.view.getSelectedNote()).view]);
            });

            $(document).bind('keydown', 'ctrl+right', function(e){
                e.preventDefault();
                var selectedIndex = self.view.getSelectedNote();
                if(self.view.getTickable(selectedIndex+1) == null) return;

                var tmp = self.song.tickables[selectedIndex];
                self.song.tickables[selectedIndex] = self.song.tickables[selectedIndex+1];
                self.song.tickables[selectedIndex+1] = tmp;

                self.view.setSelectedNote(self.view.getSelectedNote()+1);
                $.event.trigger('songChanged');
            });

            $(document).bind('keydown', 'ctrl+left', function(e){
                e.preventDefault();
                var selectedIndex = self.view.getSelectedNote();
                if(self.view.getTickable(selectedIndex-1) == null) return;

                var tmp = self.song.tickables[selectedIndex];
                self.song.tickables[selectedIndex] = self.song.tickables[selectedIndex-1];
                self.song.tickables[selectedIndex-1] = tmp;
                self.view.setSelectedNote(self.view.getSelectedNote()-1);
                $.event.trigger('songChanged');
            });
        }

        function initEvents(){
            $(document).on('playChord', function(e, i){
                SongPlayer.play(self.song, i, i);
            });

            $(document).on('chordPlayed', function(e, i){
                self.view.setSelectedNote(i);
            })
        }
    };

    return Editor;
});
require(['editor'], function(Editor){
    

    var Model = require('model');

    var app = new Editor();

    var c1 = new Model.Chord(4, [new Model.Note('C', 5), new Model.Note('E', 5), new Model.Note('G', 5)]);
    var c2 = new Model.Chord(4, [new Model.Note('F', 5), new Model.Note('B', 5)]);
    var c3 = new Model.Chord(2, [new Model.Note('A', 4), new Model.Note('C', 5), new Model.Note('E', 5)]);
    var rest = new Model.Rest(1);

    var arr = [c1, c2, c3, rest];
    app.song = new Model.Track(arr, 2);
    app.update();
});

define("main", function(){});
