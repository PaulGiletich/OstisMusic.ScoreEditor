OSTISMusic.Parser = (function(){
    function Parser(drawer){
        this.init(drawer);
    }

    Parser.prototype = {
        init: function(drawer){
            this.drawer = drawer;
        },

        parse: function(song){
            var canvas = $("")[0];
            var renderer = new Vex.Flow.Renderer(canvas,
                Vex.Flow.Renderer.Backends.CANVAS);

            var ctx = renderer.getContext();
            var stave = new Vex.Flow.Stave(10, 0, 500);
            stave.addClef("treble").setContext(ctx).draw();
        }
    };

    return Parser;
})();