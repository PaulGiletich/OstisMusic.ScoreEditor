define(function(require){

    var TimeSignature = function (signatureString) {
        var signatureArray = signatureString.split("/");
        this.upper = signatureArray[0];
        this.lower = signatureArray[1];
    };

    TimeSignature.prototype.getBarCapacity = function () {
        return this.upper / this.lower;
    };

    return TimeSignature;
});