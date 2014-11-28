define(function(require){
    var Util = require('scripts/util');

    var defaultOptions = {
        octaveShift: 0
    };

    var Track = function(bars, instrument, options = {}){
        this.options = _.defaults(options, defaultOptions);
        this.bars = bars ? bars : [];
        this.instrument = instrument;
    };

    Track.prototype.removeTickable = function(index){
        for(var ti of this.tickableIterator()){
            if(ti.indexInTrack == index){
                ti.bar.splice(ti.indexInBar, 1);
            }
        }
    };

    Track.prototype.insertTickable = function(index, tickable){
        console.log('rewrite');
        this.bars[0].tickables.splice(index, 0, tickable);
    };

    Track.prototype.tickableByIndexInTrack = function(index){
        for (var t of this.tickableIterator()){
            if(index == t.indexInTrack) return t;
        }
    };

    Track.prototype.tickableIterator = function* (){
        var bi = 0;
        var tri = 0;
        for(var bar of this.bars){
            var ti = 0;
            for(var tickable of bar.tickables){
                yield new TickableIterator({
                    tickable: tickable,
                    indexInBar: ti++,
                    indexInTrack: tri++,
                    bar: bar,
                    barIndex: bi,
                    track: this
                });
            }
            bi++;
        }
    };

    var TickableIterator = function(params){
        _.extend(this, params);
    };

    TickableIterator.prototype.remove = function(){
        if(this.bar.tickables.indexOf(this.tickable) != -1){
            this.bar.tickables.splice(this.indexInBar, 1);
        }
    };

    return Track;
});
