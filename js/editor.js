//controller
OSTISMusic.Editor = (function(){
    function Editor(){
        $('#view')
            .click(scoreClick.bind(this))
            .mousemove(mouseMove.bind(this));
        update();
    }

    var view = new OSTISMusic.View();
    var vextab = new Vex.Flow.VexTab(view.getArtist());
    var parser = new OSTISMusic.Parser();
    var song = new OSTISMusic.Song();
    var player = new OSTISMusic.Player();

    Editor.prototype = {

        setSong: function(newSong){
            song = newSong;
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
        player.playChord(song.getTickable(note.index));
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
            coords.x = prevNote.view.getAbsoluteX() + prevNote.view.getBoundingBox().w + 10;
            view.phantomNote(coords);
        }
    }

    function addNote(point){
        var prevNote = view.findPreviousNote(point);
        var note = view.getNewNoteByPos(point);
        var chord = new OSTISMusic.Chord($("#duration")[0].value, [note]);
        OSTISMusic.Util.insertToArray(song.tickables, prevNote.index+1, chord);
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
            $("#error").text(e.message);
        }
    }

    return Editor;
})();