define(function (require) {
    var Model = require('model/all');
    var SongPlayer = require('es6!song-player');
    var Instruments = require('instruments/all');
    var View = require('controller/TrackViewCtrl');

    var EditorCtrl =  function ($scope, $modal) {
        var self = this;
        $scope.song = new Model.Song();
        self.view = new View($scope);

        self.noteDuration = 4;
        self.selectedInstrument = new Instruments.NoteCreationInstrument(self, $scope);
        init();

        $scope.$watch('activeTrack.instrument', function(){
            SongPlayer.updateInstruments($scope.song);
        }, true);

        function init(){
            initButtons();
            initHotkeys();
        }

        self.setNoteDuration = function(duration){
            self.noteDuration = duration;
            $scope.selection[0].tickable.duration = duration;
        };

        self.setActiveTrack = function(track){
            $scope.activeTrack = track;
        };

        self.getAllInstruments = function(){
            return Model.Instrument.getAllInstruments();
        };

        self.changeTrackInstrument = function(id){
            $scope.activeTrack.instrument = _.find(Model.Instrument.getAllInstruments(), function(instr){
                return instr.id = id;
            });
        };

        self.newTrack = function(){
            var bar = new Model.Bar([], "4/4");
            var track = new Model.Track([bar], new Model.Instrument("acoustic_grand_piano"));
            $scope.song.tracks.push(track);
            $scope.activeTrack = track;
            return track;
        };

        self.removeTrack = function(track){
            var index = $scope.song.tracks.indexOf(track);
            $scope.song.tracks.splice(index, 1);
            $scope.activeTrack = $scope.song.tracks[index > 0 ? index - 1: index];
        };

        function initButtons(){

            $('.play').click(function(){
                SongPlayer.play($scope.song);
            });

            $('.stop').click(function(){
                SongPlayer.stop();
            });
//
//            $('.accidental-sharp').click(function setNoteSharp(){
//                var chord = $scope.song.getTickable(self.view.getSelectedNote());
//                chord.notes[0].flat = false;
//                chord.notes[0].sharp = true;//TODO: change when making editable chords
//                $.event.trigger('songChanged');
//                self.player.playNote([self.view.getTickable(self.view.getSelectedNote()).view]);
//            });
//            $('.accidental-flat').click(function setNoteFlat(){
//                var chord = $scope.song.getTickable(self.view.getSelectedNote());
//                chord.notes[0].flat = true;
//                chord.notes[0].sharp = false;
//                $.event.trigger('songChanged');
//                self.player.playNote([self.view.getTickable(self.view.getSelectedNote()).view]);
//            });
//            $('.accidental-none').click(function setNoteDefault(){
//                var chord = $scope.song.getTickable(self.view.getSelectedNote());
//                chord.notes[0].flat = false;
//                chord.notes[0].sharp = false;
//                $.event.trigger('songChanged');
//                self.player.playNote([self.view.getTickable(self.view.getSelectedNote()).view]);
//            });

            $('.tickable.note').click(function(event){
                $('.tickables .tickable').removeClass('active');
                $(event.target).addClass('active');
                self.selectedInstrument = new Instruments.NoteCreationInstrument(self, $scope);
            });

            $('.tickable.rest').click(function(event){
                $('.tickables .tickable').removeClass('active');
                $(event.target).addClass('active');
                self.selectedInstrument = new Instruments.RestCreationInstrument(self, $scope);
            });

            $(document)
                .on('playerReady', function () {
                    $scope.$apply(function(){
                        $scope.playerReady = true;
                    })
                })
                .on('playerLoading', function () {
                    $scope.playerReady = false;
                });
        }

        function initHotkeys(){

            $(document).bind('keydown', 'del', function(){
                $scope.$apply(function(){
                    _.each($scope.selection, function(ti){
                        ti.remove();
                    });
                    $scope.selection = null;
                });
            });
//
//            $(document).bind('keydown', 'left', function(){
//                self.view.setSelectedNote(self.view.getSelectedNote()-1);
//            });
//
//            $(document).bind('keydown', 'right', function(){
//                self.view.setSelectedNote(self.view.getSelectedNote()+1);
//            });
//
//            $(document).bind('keydown', 'ctrl+up', function(e){
//                e.preventDefault();
//                var chord = $scope.song.getTickable(self.view.getSelectedNote());//TODO change when making editable chords
//                for(var i = 0; i < chord.notes.length; i++){
//                    var note = chord.notes[i];
//                    var newKey = Util.getNoteNumberByKey(note.key) + 1;
//                    if(newKey < 7){
//                        note.key = Util.getKeyByNumber(newKey);
//                    }
//                    else {
//                        note.octave++;
//                        note.key = Util.getKeyByNumber(newKey % 7);
//                    }
//                }
//                $.event.trigger('songChanged');
//            });
//
//            $(document).bind('keydown', 'ctrl+down', function(e){
//                e.preventDefault();
//                var chord = $scope.song.getTickable(self.view.getSelectedNote());//TODO change when making editable chords
//                for(var i = 0; i < chord.notes.length; i++){
//                    var note = chord.notes[i];
//                    var newKey = Util.getNoteNumberByKey(note.key) - 1;
//                    if(newKey >= 0){
//                        note.key = Util.getKeyByNumber(newKey);
//                    }
//                    else {
//                        note.octave--;
//                        note.key = Util.getKeyByNumber(7 + newKey % 7);
//                    }
//                }
//                $.event.trigger('songChanged');
//            });
//
//            $(document).bind('keydown', 'ctrl+right', function(e){
//                e.preventDefault();
//                var selectedIndex = self.view.getSelectedNote();
//                if(self.view.getTickable(selectedIndex+1) == null) return;
//
//                var tmp = $scope.song.tickables[selectedIndex];
//                $scope.song.tickables[selectedIndex] = $scope.song.tickables[selectedIndex+1];
//                $scope.song.tickables[selectedIndex+1] = tmp;
//
//                self.view.setSelectedNote(self.view.getSelectedNote()+1);
//                $.event.trigger('songChanged');
//            });
//
//            $(document).bind('keydown', 'ctrl+left', function(e){
//                e.preventDefault();
//                var selectedIndex = self.view.getSelectedNote();
//                if(self.view.getTickable(selectedIndex-1) == null) return;
//
//                var tmp = $scope.song.tickables[selectedIndex];
//                $scope.song.tickables[selectedIndex] = $scope.song.tickables[selectedIndex-1];
//                $scope.song.tickables[selectedIndex-1] = tmp;
//                self.view.setSelectedNote(self.view.getSelectedNote()-1);
//                $.event.trigger('songChanged');
//            });
        }

        this.newTrack();

    };

    return EditorCtrl;
});