define({
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
    keyboardNotes: ['C', 'Db', 'D', 'Eb', "E", 'F', "Gb", 'G', 'Ab', 'A', 'Bb', 'B'],


    getKeyByNumber: function getKeyByNumber(number){
        return this.notes[number];
    },

    getNoteNumberByKey: function getNoteNumberByKey(key){
        return this.notes.indexOf(key);
    },

    saveFile: function (filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        pom.click();
    }

});