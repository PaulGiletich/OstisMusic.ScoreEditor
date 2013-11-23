OSTISMusic.View = (function(){

function View(){
        this.init();
    };

    View.prototype = {
        init: function(){
            this.canvas = $("#canvas")[0];
            this.renderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.CANVAS);
            this.artist = new Vex.Flow.Artist(10, 10, 600, {});
        },

        update: function(){
            this.artist.render(this.renderer);
        },

        findNote: function(point){
            var contains = OSTISMusic.Util.contains;

            for (var i = 0; i < this.artist.staves.length; i++){
                var stave = this.artist.staves[i];
                var boundingBox = stave.note.getBoundingBox();
                if(contains(boundingBox, point)){
                    this.debugRect(boundingBox);
                    for(var j = 0; j < stave.note_voices.length; j++){
                        var voice = stave.note_voices[j];
                        for(var inote = 0; inote < voice.length; inote++){
                            var note = voice[inote];
                            if(contains(note.getBoundingBox(), point)){
                                //return
                            }
                            this.debugRect(note.getBoundingBox());
                        }
                    }
                }
            }
            return i;
        },

        debugRect: function(rect){
            var ctx=this.canvas.getContext("2d");
            ctx.globalAlpha = 0.1;
            ctx.fillStyle="#0000FF";
            ctx.fillRect(rect.x,rect.y,
                rect.w,rect.h);
        }
    }

    return View;
})();