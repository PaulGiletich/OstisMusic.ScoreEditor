define(['util', 'model/all', 'es6!parser', 'canvas-extensions'],
function(Util, Model, Parser){

    /**
     * @constructor
     */
    var TrackViewCtrl = function ($scope){
        var self = this;

        var canvas = $("#canvas")[0];
        var hoverCanvas = $("#hoverCanvas")[0];
        var selectionCanvas = $("#selectionCanvas")[0];

        var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
        var artist = new Vex.Flow.Artist(0, 0, window.innerWidth); Vex.Flow.Artist.NOLOGO = true;
        var vextab = new Vex.Flow.VexTab(artist);

        var parser = new Parser();

        var selectedNote = null;
        self.notesPerLine = 8;


        self.update = function(){
            try {
                vextab.reset();
                artist.reset();
                vextab.parse(parser.parse($scope.activeTrack, {
                    notesPerLine: self.notesPerLine,
                    width: canvas.width
                }));
                artist.render(renderer);
                hoverCanvas.width = selectionCanvas.width = canvas.width;
                hoverCanvas.height = selectionCanvas.height  = canvas.height;
                drawSelection();
                $(".error").empty();
            } catch (e) {
                console.log(e);
                $(".error").text(e.message);
            }
        };

        /**
         * transforms event to local coordinated
         * @param event
         * @returns {}
         */
        self.toLocalCoords = function(event){
            return canvas.relMouseCoords(event);
        };

        /**
         * iterator by each note of view. if you done with iteration, return true in callback, so it will not iterate more
         * @param {Function} callback
         */
        self.eachTickable = function(callback){
            var curr_i = -1;

            for (var si = 0; si < artist.staves.length; si++){
                var stave = artist.staves[si];

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

        self.findNote = function(point){
            var contains = Util.contains;
            var enlarge = Util.enlarge;

            var result = null;
            self.eachTickable(function(note, index){
                if(contains(enlarge(note.getBoundingBox(), 8), point)){
                    result = {index: index, view: note};
                    return true;
                }
                return false;
            });
            return result;
        };

        self.findPreviousNote = function(point){
            var stave = self.findStave(point);
            if(!stave) return null;

            var result = null;
            self.eachTickable(function(note, index){
                if (note.getStave() == stave.note && note.getAbsoluteX() > point.x) {
                    return true;
                }
                //self happens in the end of line, next note x is not greater, but note is actually previous
                if (result && result.view.getStave() == stave.note && note.getStave() != stave.note) {
                    return true;
                }
                //self happens at the start, when there is no previous note
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
        self.findStave = function(point){
            var contains = Util.contains;

            for (var i = 0; i < artist.staves.length; i++){
                var stave = artist.staves[i];
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
        self.getNewNoteByPos = function(point){
            var stave = self.findStave(point).note;

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

        self.phantomNote = function(point){
            var ctx=hoverCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalAlpha = 0.5;
            ctx.fillStyle="#000000";
            ctx.roundRect(point.x,point.y,
                0,0, true, 5);
        };

        self.phantomRest = function(p){
            var ctx=hoverCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalAlpha = 0.5;
            ctx.fillStyle="#000000";

            var stave = self.findStave(p).note;
            ctx.roundRect(p.x,stave.getYForLine(1),
                0,stave.getYForLine(3) - stave.getYForLine(1), true, 5);
        };

        self.highlightNote = function(note){
            var ctx=hoverCanvas.getContext("2d");
            ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
            if(!note) return;

            var rect = note.getBoundingBox();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle="#0000FF";
            ctx.roundRect(rect.x,rect.y,
                rect.w,rect.h, true, 6);
        };

        self.getTickable = function(index){
            var result = null;
            self.eachTickable(function(note, i){
                if(i == index){
                    result = {index: i, view: note};
                    return true;
                }
                return false;
            });
            return result;
        };

        function drawSelection(){
            var ctx = selectionCanvas.getContext("2d");
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if($scope.selection != null){
                var rect = self.getTickable($scope.selection[0].indexInTrack).view.getBoundingBox();
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = "#0000FF";
                ctx.roundRect(rect.x, rect.y,
                    rect.w, rect.h, true, 6);
            }
        }

        $scope.$watch('activeTrack', function(){
            self.update();
        }, true);

        $scope.$watch('selection', function (){
            drawSelection()
        }, true);

        $(document).on('chordPlayed', function(e, i){
            if($scope.activeTrack == i.track){
                self.highlightNote(self.getTickable(i.indexInTrack).view);
            }
        });

        window.addEventListener('resize', onResize);
        var onResize = function updateResize() {
            canvas.width = $(".canvas-layers").innerWidth() - 100;
            self.update();
        };
        onResize();
    };

    return TrackViewCtrl;
});

