//controller
OSTISMusic.Editor = function (){
    var view = new OSTISMusic.View();
    var vextab = new Vex.Flow.VexTab(view.getArtist());
    var parser = new OSTISMusic.Parser(view);
    var song = new OSTISMusic.Song();
    var player = initPlayer();
    var newNoteDuration = $('#duration').find('.active').attr("value");

    console.log('loading player');
    $('.controls .button').addClass('disabled');
    OSTISMusic.PlayerLoader.initPlayer(function(){
        console.log('player ready');
        $('.controls .button').removeClass('disabled');
    });

    this.setSong = function(newSong){
        song = newSong;
        update();
    };

    function bindEvents(){
        $('#view')
            .click(scoreClick.bind(this))
            .mousemove(mouseMove.bind(this));

        $('#duration').find('a.item')
            .click(function(event){
                $('#duration').find('a.item').removeClass("active");
                event.target.className += " active";
                newNoteDuration = event.target.getAttribute("value");
                song.getTickable(view.getSelectedNote()).duration = newNoteDuration;
                update();
            }.bind(this));

        $('.controls .play').click(function(){
            player.play();
        });
        $('.controls .stop').click(function(){
            player.stop();
        });

        $('.sharp').click(switchNoteSharp.bind(this));

        $('html').keyup(function(e){
            //delete key pressed
            if(e.keyCode == 46) deleteNote();
        }.bind(this));

        window.addEventListener('resize', function () {
            view.setWidth($(".canvas-layers").innerWidth() - 100);
            update();
        }.bind(this));
    }

    function initPlayer(){
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
        song.tickables.splice(view.getSelectedNote(), 1);
        update();
    }

    function update(){
        try {
            vextab.reset();
            view.getArtist().reset();
            vextab.parse(parser.parse(song));
            view.update();
            $("#error").text("");
        } catch (e) {
            console.log(e);
            console.log(e.message);
            $("#error").text(e.message);
        }
    }

    function switchNoteSharp(){
        var chord = song.getTickable(view.getSelectedNote());
        chord.notes[0].sharp = !chord.notes[0].sharp;//TODO: change when making editable chords
        update();
    }

    bindEvents.bind(this)();
}