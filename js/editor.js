define(['model', 'view', 'player', 'util', 'parser', 'instruments/instruments', 'serializer/json-serializer'],
function(Model, View, Player, Util, Parser, Instruments, Serializer){
        "use strict";

    // This is fucking hell.
    var Editor = function (){

        var self = this;
        this.song = new Model.Song();
        this.view = new View();
        var vextab = new Vex.Flow.VexTab(this.view.artist);
        var parser = new Parser(this.view);
        this.player = createVexPlayer();
        this.newNoteDuration = $('.durations .active').attr("value");
        this.selectedInstrument = new Instruments.NoteCreationInstrument(this);

        init();

        function init(){
            initPlayer();
            initScore();
            initButtons();
            initHotkeys();
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

        function initPlayer(){
            console.log('loading player');
            Player.init().then(function(){
                $('.player-control').removeClass('disabled');
            });
        }

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
                self.player.play();
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
                Util.saveFile('song.json', Serializer.serialize(song));
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

        /**
         * @returns {Vex.Flow.Player}
         */
        function createVexPlayer(){
            var player = new Vex.Flow.Player(self.view.artist, {
                soundfont_url: "soundfont/",
                show_controls: false,
                tempo: 50
            });

            //override :)
            player.updateMarker = function(x, y){
                var note = self.view.findPreviousNote({x: x, y: y});
                self.view.playingNote(note);
            };
            return player;
        }
    };

    return Editor;
});