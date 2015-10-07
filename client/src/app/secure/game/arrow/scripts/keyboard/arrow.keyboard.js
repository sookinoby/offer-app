(function(){
'use strict';
angular.module('arrowKeyboard', []).service('ArrowGameKeyboardService', function($q, $document) {
    var UP = 'up',
        RIGHT = 'right',
        DOWN = 'down',
        LEFT = 'left',
        ENTER = 'enter';
    var keyboardMap = {
        37: LEFT,
        38: UP,
        39: RIGHT,
        40: DOWN,
        13: ENTER
    };
    this.init = function() {
        var self = this;
        $document.bind('keydown', function(evt) {
            var key = keyboardMap[evt.which];
            if (key) {
                // An interesting key was pressed
                evt.preventDefault();
                self._handleKeyEvent(key, evt);
            }
        });
    };
    this.destroy = function() {
        var self = this;
        $document.unbind('keydown');
    };
    this.keyEvents = null;
    this.on = function(cb) {
        this.keyEvents = cb;
    };
    this._handleKeyEvent = function(key, evt) {
        var callbacks = this.keyEvents;
        if (!callbacks) {
            return;
        }
        evt.preventDefault();
        if (callbacks) {
            //  for (var x = 0; x < callbacks.length; x++) {
            var cb = callbacks;
            cb(key, evt);
            // }
        }
    };
});
})();