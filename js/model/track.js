define(function(require){
    var Util = require('util');

    var defaultOptions = {
        octaveShift: 0
    };

    var Track = function(bars, instrument, options = {}){
        this.options = _.defaults(options, defaultOptions);
        this.bars = bars ? bars : [];
        this.instrument = instrument;
    };

    Track.prototype.removeTickable = function(index){
//        this.eachTickable((tickable, barIndex, tickableIndex) => {
//            //todo
//        });
        this.tickables.splice(index, 1);
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
                yield {
                    tickable: tickable,
                    indexInBar: ti++,
                    indexInTrack: tri++,
                    bar: bar,
                    barIndex: bi,
                    track: this
                };
            }
            bi++;
        }
    };
    return Track;
});
