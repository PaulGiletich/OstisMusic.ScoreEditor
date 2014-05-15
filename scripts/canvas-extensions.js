define(function(){

    /**
     * transforms event point coordinates relative to canvas
     * @param event {event}
     * @returns {{x: number, y: number}}
     */
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

    /**
     * helper method to draw a rounded rect on canvas
     * @param x
     * @param y
     * @param width
     * @param height
     * @param outerRect
     * @param radius
     * @param fill
     * @param stroke
     */
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

});