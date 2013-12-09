OSTISMusic.Util = {
    contains: function contains(rect, point){
        return (rect.x < point.x  &&
            rect.y < point.y &&
            rect.x + rect.w > point.x &&
            rect.y + rect.h > point.y);
    },

    enlarge: function enlarge(rect, amount){
    return {x: rect.x - amount,
        y: rect.y - amount,
        w: rect.w + amount*2,
        h: rect.h + amount*2};
    },

    insertToArray: function(arr, index, item){
        arr = arr.splice(index, 0, item);
    },

    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],

    getKeyByNumber: function(number){
        return this.notes[number];
    },

    getNoteNumberByKey: function(key){
        return this.notes.indexOf(key);
    },

    tickablesReviver: function(key, value) {
        if(value.hasOwnProperty('key')
            && value.hasOwnProperty('octave')
            && value.hasOwnProperty('sharp')
            && value.hasOwnProperty('flat')){
            return new OSTISMusic.Note(value.key, value.octave, value);
        }
        if(value.hasOwnProperty('type')){//TODO consider better parsing
            return new OSTISMusic.BarNote(value.type)
        }
        if(value.hasOwnProperty('tickables')){
            return new OSTISMusic.Song(value.tickables);
        }
        if (value.hasOwnProperty('notes')
            && value.hasOwnProperty('duration')) {
            return new OSTISMusic.Chord(value.duration, value.notes);
        }
        if(value.hasOwnProperty('duration')
            && ! value.hasOwnProperty('notes')){
            return new OSTISMusic.RestChord(value.duration);
        }
        return value;
    }
};

OSTISMusic.Util.saveFile = function (filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
};

HTMLCanvasElement.prototype.relMouseCoords = function (event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
};

CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, outerRect, radius, fill, stroke) {
    if (typeof outerRect == "undefined"){
        outerRect = false;
    }
    if (typeof fill == "undefined" ) {
        fill = true;
    }
    if (typeof stroke == "undefined" ) {
        stroke = false;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }

    if(outerRect){
        x -= radius;
        y -= radius;
        width += radius * 2;
        height += radius * 2;
    }
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
};
