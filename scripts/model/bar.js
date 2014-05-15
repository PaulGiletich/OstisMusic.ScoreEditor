define(function(require){

    var Bar = function (tickables, timeSignature) {
        this.tickables = tickables;
        this.timeSignature = timeSignature;
    };

    Bar.prototype.timeValue = function (){
        var barValue = 0;
        _.forEach(this.tickables, function(tickable){
            barValue += 1/tickable.duration;
        });
        return barValue;
    };

    Bar.prototype.isValid = function () {
        return this.timeValue() == this.timeSignature.getBarCapacity();
    };

    return Bar;
});