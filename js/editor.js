/**
 *
 * @constructor
 */
OSTISMusic.Editor = function (){

    var _this = this;
    /** @type {OSTISMusic.Song}  */
    this.song = new OSTISMusic.Song();
    /** @type {OSTISMusic.View} */
    this.view = new OSTISMusic.View();
    var vextab = new Vex.Flow.VexTab(this.view.artist);
    var parser = new OSTISMusic.Parser(this.view);
    /** @type {Vex.Flow.Player} */
    this.player = createVexPlayer();
    /** @type {Number} */
    this.newNoteDuration = $('.durations .active').attr("value");
    /** @type {OSTISMusic.Instrument} */
    this.selectedInstrument = new OSTISMusic.Instrument.NoteCreationInstrument(this);

    //TODO read about how do events registrated in single-page applications, cleanup this event hell
    initScore();
    initButtons();
    initPlayer();
    initHotkeys();

    function initPlayer(){
        console.log('loading player');
        OSTISMusic.PlayerLoader.initPlayer(function(){
            console.log('player ready');
            $('.player-control').removeClass('disabled');
        });
    }

    function initScore(){
        $('.canvas-layers')
            .click(function(e) {
                _this.selectedInstrument.scoreClick(e);
            })
            .mousemove(function(e) {
                _this.selectedInstrument.mouseMove(e);
            });

        $(document).bind('songChanged', function(){
            _this.update();
        });

        window.addEventListener('resize', function () {
            _this.view.setWidth($(".canvas-layers").innerWidth() - 100);
            _this.update();
        });
    }

    function initButtons(){

        $('.durations .item')
            .click(function(event){
                $('.durations .item').removeClass("active");
                $(event.target).addClass('active');
                _this.newNoteDuration = event.target.getAttribute("value");
                _this.song.getTickable(_this.view.getSelectedNote()).duration = _this.newNoteDuration;
                $.event.trigger('songChanged');
            });

        $('.play').click(function(){
            _this.player.play();
        });
        $('.stop').click(function(){
            _this.player.stop();
        });

        $('.accidental-sharp').click(function setNoteSharp(){
            var chord = _this.song.getTickable(_this.view.getSelectedNote());
            chord.notes[0].flat = false;
            chord.notes[0].sharp = true;//TODO: change when making editable chords
            $.event.trigger('songChanged');
            _this.player.playNote([_this.view.getTickable(_this.view.getSelectedNote()).view]);
        });
        $('.accidental-flat').click(function setNoteFlat(){
            var chord = _this.song.getTickable(_this.view.getSelectedNote());
            chord.notes[0].flat = true;
            chord.notes[0].sharp = false;
            $.event.trigger('songChanged');
            _this.player.playNote([_this.view.getTickable(_this.view.getSelectedNote()).view]);
        });
        $('.accidental-none').click(function setNoteDefault(){
            var chord = _this.song.getTickable(_this.view.getSelectedNote());
            chord.notes[0].flat = false;
            chord.notes[0].sharp = false;
            $.event.trigger('songChanged');
            _this.player.playNote([_this.view.getTickable(_this.view.getSelectedNote()).view]);
        });

        $('.tickable.note').click(function(event){
            $('.tickables .tickable').removeClass('active');
            $(event.target).addClass('active');
            _this.selectedInstrument = new OSTISMusic.Instrument.NoteCreationInstrument(_this);
        });

        $('.tickable.rest').click(function(event){
            $('.tickables .tickable').removeClass('active');
            $(event.target).addClass('active');
            _this.selectedInstrument = new OSTISMusic.Instrument.RestCreationInstrument(_this);
        });

        $(".save").click(function(){
            OSTISMusic.Util.saveFile('song.json', JSON.stringify(_this.song, null, '\t'));
        });
        $(".open").click(function(ev){
            $("#hiddenFileInput")
                .click()
                .bind('change', function(){
                    var reader = new FileReader();
                    reader.onload = function(e){
                        _this.song = JSON.parse(e.target.result, OSTISMusic.Util.tickablesReviver);
                        $.event.trigger('songChanged');
                    };
                    reader.readAsText($("#hiddenFileInput")[0].files[0]);
                });
        });
    }

    function initHotkeys(){

        $(document).bind('keydown', 'del', function(){
            _this.song.removeTickable(_this.view.getSelectedNote());
            $.event.trigger('songChanged');
        });

        $(document).bind('keydown', 'left', function(){
            _this.view.setSelectedNote(_this.view.getSelectedNote()-1);
        });

        $(document).bind('keydown', 'right', function(){
            _this.view.setSelectedNote(_this.view.getSelectedNote()+1);
        });

        $(document).bind('keydown', 'ctrl+up', function(e){
            e.preventDefault();
            var chord = _this.song.getTickable(_this.view.getSelectedNote());//TODO change when making editable chords
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
            $.event.trigger('songChanged');
            _this.player.playNote([_this.view.getTickable(_this.view.getSelectedNote()).view]);
        });

        $(document).bind('keydown', 'ctrl+down', function(e){
            e.preventDefault();
            var chord = _this.song.getTickable(_this.view.getSelectedNote());//TODO change when making editable chords
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
            $.event.trigger('songChanged');
            _this.player.playNote([_this.view.getTickable(_this.view.getSelectedNote()).view]);
        });

        $(document).bind('keydown', 'ctrl+right', function(e){
            e.preventDefault();
            var selectedIndex = _this.view.getSelectedNote();
            if(_this.view.getTickable(selectedIndex+1) == null) return;

            var tmp = _this.song.tickables[selectedIndex];
            _this.song.tickables[selectedIndex] = _this.song.tickables[selectedIndex+1];
            _this.song.tickables[selectedIndex+1] = tmp;

            _this.view.setSelectedNote(_this.view.getSelectedNote()+1);
            $.event.trigger('songChanged');
        });

        $(document).bind('keydown', 'ctrl+left', function(e){
            e.preventDefault();
            var selectedIndex = _this.view.getSelectedNote();
            if(_this.view.getTickable(selectedIndex-1) == null) return;

            var tmp = _this.song.tickables[selectedIndex];
            _this.song.tickables[selectedIndex] = _this.song.tickables[selectedIndex-1];
            _this.song.tickables[selectedIndex-1] = tmp;

            _this.view.setSelectedNote(_this.view.getSelectedNote()-1);
            $.event.trigger('songChanged');
        });
    }

    /**
     * @returns {Vex.Flow.Player}
     */
    function createVexPlayer(){
        var player = new Vex.Flow.Player(_this.view.artist, {
            soundfont_url: "soundfont/",
            show_controls: false,
            tempo: 50
        });

        //override :)
        player.updateMarker = function(x, y){
            var note = _this.view.findPreviousNote({x: x, y: y});
            _this.view.playingNote(note);
        };
        return player;
    }

    /**
     * Reparse song and update scene
     */
    this.update = function(){
        try {
            vextab.reset();
            _this.view.artist.reset();
            vextab.parse(parser.parse(_this.song));
            _this.view.update();
            $(".error").text("");
        } catch (e) {
            console.log(e);
            console.log(e.message);
            $(".error").text(e.message);
        }
    };

};