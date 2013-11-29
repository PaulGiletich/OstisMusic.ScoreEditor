//controller
OSTISMusic.Editor = (function(){
    function Editor(){
        this.player = player;

        $('#view')
            .click(scoreClick.bind(this))
            .mousemove(mouseMove.bind(this));

//        $('.canvas-layers').bind('resize', function(){
//            view.setWidth($('.canvas-layers').width()-20);
//            this.update();
//        }.bind(this));

        $('#duration').find('a.item')
            .click(function(event){
                $('#duration').find('a.item').removeClass("active");
                event.target.className += " active";
                newNoteDuration = event.target.getAttribute("value");
            });

        $('.controls .play').click(function(){
            player.play();
        });
        $('.controls .stop').click(function(){
            player.stop();
        });

        $('html').keyup(function(e){
            if(e.keyCode == 46) deleteNote();
        });

        window.addEventListener('resize', function resizeCanvas() {
            view.canvas.width = $(".canvas-layers").innerWidth() - 100;
            update();
        }.bind(this));
    }

    var view = new OSTISMusic.View();
    view.canvas.width = $(".canvas-layers").innerWidth() - 100;
    var vextab = new Vex.Flow.VexTab(view.getArtist());
    var parser = new OSTISMusic.Parser(view);
    var song = new OSTISMusic.Song();
    var player = new Vex.Flow.Player(view.getArtist(), {
        soundfont_url: "soundfont/",
        show_controls: false,
        tempo: 50
    });
    player.updateMarker = function(x, y){//override :)
        var note = view.findPreviousNote({x: x, y: y});
        view.playingNote(note);
    };

    var newNoteDuration = $('#duration').find('.active').attr("value");

    Editor.prototype = {

        setSong: function(newSong){
            song = newSong;
            update();
        },

        update: function(){
            update();
        }
    };

    function scoreClick(e){
        var coords = view.canvas.relMouseCoords(e);
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
        //player.playChord(song.getTickable(note.index));
        view.setSelectedNote(note);
    }

    function mouseMove(e){
        var coords = view.canvas.relMouseCoords(e);
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
    }

    function deleteNote(){
        var note = view.selectedNote;
        song.tickables.splice(note.index, 1);
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

    return Editor;
})();