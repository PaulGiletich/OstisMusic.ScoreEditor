//controller
OSTISMusic.Editor = function (){
    var view = new OSTISMusic.View();
    var vextab = new Vex.Flow.VexTab(view.getArtist());
    var parser = new OSTISMusic.Parser(view);
    var song = new OSTISMusic.Song();
    var player = createVexPlayer();
    var newNoteDuration = $('.durations .active').attr("value");

    initScore();
    initButtons();
    initPlayer();
    initHotkeys();

    this.setSong = function(newSong){
        song = newSong;
        update();
    };

    function initPlayer(){
        console.log('loading player');
        OSTISMusic.PlayerLoader.initPlayer(function(){
            console.log('player ready');
            $('.player-control').removeClass('disabled');
        });
    }

    function initScore(){
        $('.canvas-layers')
            .click(scoreClick.bind(this))
            .mousemove(mouseMove.bind(this));

        window.addEventListener('resize', function () {
            view.setWidth($(".canvas-layers").innerWidth() - 100);
            update();
        }.bind(this));
    }

    function initButtons(){

        $('.durations .item')
            .click(function(event){
                $('.durations .item').removeClass("active");
                event.target.className += " active";
                newNoteDuration = event.target.getAttribute("value");
                song.getTickable(view.getSelectedIndex()).duration = newNoteDuration;
                update();
            }.bind(this));

        $('.play').click(function(){
            player.play();
        });
        $('.stop').click(function(){
            player.stop();
        });

        $('.accidental-sharp').click(setNoteSharp);
        $('.accidental-flat').click(setNoteFlat);
        $('.accidental-none').click(setNoteDefault);

        $(".save").click(function(){
            OSTISMusic.Util.saveFile('song.json', JSON.stringify(song, null, '\t'));
        });

        $(".load").click(function(ev){
            $("#hiddenFileInput")
                .click()
                .bind('change', function(){
                    var reader = new FileReader();
                    reader.onload = function(e){
                        song = JSON.parse(e.target.result, OSTISMusic.Util.tickablesReviver);
                        update()
                    };
                    reader.readAsText($("#hiddenFileInput")[0].files[0]);
                });
        });
    }

    function initHotkeys(){

        $(document).bind('keydown', 'del', function(){
            deleteNote();
        }.bind(this));

        $(document).bind('keydown', 'left', function(){
            view.setSelectedNote(view.getSelectedIndex()-1);
        }.bind(this));

        $(document).bind('keydown', 'right', function(){
            view.setSelectedNote(view.getSelectedIndex()+1);
        }.bind(this));

        $(document).bind('keydown', 'ctrl+up', function(e){
            e.preventDefault();
            var chord = song.getTickable(view.getSelectedIndex());//TODO change when making editable chords
            for(var i = 0; i < chord.notes.length; i++){
                var note = chord.notes[i];
                var newKey = OSTISMusic.Util.getNoteNumberByKey(note.key) + 1;
                if(newKey < 7){
                    note.key = OSTISMusic.Util.getKeyByNumber(newKey);
                }
                else {
                    note.octave++;
                    note.key = OSTISMusic.Util.getKeyByNumber(newKey % 7);
                }
            }
            update();
            player.playNote([view.getTickable(view.getSelectedIndex()).view]);
        });

        $(document).bind('keydown', 'ctrl+down', function(e){
            e.preventDefault();
            var chord = song.getTickable(view.getSelectedIndex());//TODO change when making editable chords
            for(var i = 0; i < chord.notes.length; i++){
                var note = chord.notes[i];
                var newKey = OSTISMusic.Util.getNoteNumberByKey(note.key) - 1;
                if(newKey >= 0){
                    note.key = OSTISMusic.Util.getKeyByNumber(newKey);
                }
                else {
                    note.octave--;
                    note.key = OSTISMusic.Util.getKeyByNumber(7 + newKey % 7);
                }
            }
            update();
            player.playNote([view.getTickable(view.getSelectedIndex()).view]);
        });

        $(document).bind('keydown', 'ctrl+right', function(e){
            var selectedIndex = view.getSelectedIndex();
            if(view.getTickable(selectedIndex+1) == null) return;

            var tmp = song.tickables[selectedIndex];
            song.tickables[selectedIndex] = song.tickables[selectedIndex+1];
            song.tickables[selectedIndex+1] = tmp;

            view.setSelectedNote(view.getSelectedIndex()+1);
            update();
        });

        $(document).bind('keydown', 'ctrl+left', function(){
            var selectedIndex = view.getSelectedIndex();
            if(view.getTickable(selectedIndex-1) == null) return;

            var tmp = song.tickables[selectedIndex];
            song.tickables[selectedIndex] = song.tickables[selectedIndex-1];
            song.tickables[selectedIndex-1] = tmp;

            view.setSelectedNote(view.getSelectedIndex()-1);
            update();
        });
    }

    function createVexPlayer(){
        var player = new Vex.Flow.Player(view.getArtist(), {
            soundfont_url: "soundfont/",
            show_controls: false,
            tempo: 50
        });
        player.updateMarker = function(x, y){//override :)
            var note = view.findPreviousNote({x: x, y: y});
            view.playingNote(note);
        }.bind(this);
        return player;
    }

    function scoreClick(e){
        var coords = view.getLocalCoords(e);
        var note = view.findNote(coords);
        if(note){
            noteClicked(note);
            return;
        }
        var lastNote = view.findPreviousNote(coords);
        if(lastNote){
            addNote(coords);
        }
    }

    function noteClicked(note){
        player.playNote([note.view]);
        view.setSelectedNote(note.index);
    }

    function mouseMove(e){
        var coords = view.getLocalCoords(e);
        var note = view.findNote(coords);
        var prevNote = view.findPreviousNote(coords);
        if(note){
            view.highlightNote(note);
        }
        else if (prevNote){

            view.highlightNote(prevNote);
            coords.y = coords.y - coords.y % 5;
            coords.x = prevNote.view.getAbsoluteX() + prevNote.view.getBoundingBox().w + 15;
            view.phantomNote(coords);
        }
    }

    function addNote(point){
        var prevNote = view.findPreviousNote(point);
        var note = view.getNewNoteByPos(point);
        var chord = new OSTISMusic.Chord(newNoteDuration, [note]);
        OSTISMusic.Util.insertToArray(song.tickables, prevNote.index+1, chord);
        update();
        view.setSelectedNote(prevNote.index+1);
    }

    function deleteNote(){
        song.tickables.splice(view.getSelectedIndex(), 1);
        update();
    }

    function update(){
        try {
            vextab.reset();
            view.getArtist().reset();
            vextab.parse(parser.parse(song));
            view.update();
            $(".error").text("");
        } catch (e) {
            console.log(e);
            console.log(e.message);
            $(".error").text(e.message);
        }
    }

    function setNoteSharp(){
        var chord = song.getTickable(view.getSelectedIndex());
        chord.notes[0].flat = false;
        chord.notes[0].sharp = true;//TODO: change when making editable chords
        update();
        player.playNote([view.getTickable(view.getSelectedIndex()).view]);
    }

    function setNoteFlat(){
        var chord = song.getTickable(view.getSelectedIndex());
        chord.notes[0].flat = true;
        chord.notes[0].sharp = false;
        update();
        player.playNote([view.getTickable(view.getSelectedIndex()).view]);
    }

    function setNoteDefault(){
        var chord = song.getTickable(view.getSelectedIndex());
        chord.notes[0].flat = false;
        chord.notes[0].sharp = false;
        update();
        player.playNote([view.getTickable(view.getSelectedIndex()).view]);
    }
};