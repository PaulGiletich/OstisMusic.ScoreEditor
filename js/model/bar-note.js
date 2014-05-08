define(function(require){

    var BarNote = function (type){
        var types = {
            "SINGLE": "|",
            "DOUBLE": "=||",
            "END"   : "=|=",
            "RBEGIN": "=|:",
            "REND"  : "=:|"
        };

        if(!type in types){
            throw "Incorrect bar type";
        }

        this.type = type;
    };

    return BarNote;
});
