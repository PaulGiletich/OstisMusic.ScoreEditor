define(function(){
    "use strict";
    var self = this;
    var $keyboard = $('.keyboard');

    function initEvents(){
        $('.key').mousedown(function(e){
            $(e.currentTarget).addClass('key-pressed');
        });
        $('.keyboard').mouseup(function(e){
            $('.key').removeClass('key-pressed');
        });
    }

    var Keyboard = {
        init: function(){
            initEvents();
        }
    };

    return Keyboard;
});