(function (Tools) {
    Tools.Pan = (function () {
        var
        //hidden cursor
        _cursor = new Kinetic.Circle({
            strokeWidth: 0,
            radius: 0
        }),

        //flag to track whether or not the pen is down
        _startPosition,
          
        //initialize
        _init = function () {
        },

        _penDown = function (pos, context) {
            var currentOffset = context.drawingLayer.getOffset();
            _startPosition = { x: pos.x + currentOffset.x, y: pos.y + currentOffset.y };
        },

        //save each point in the current drawing
        //and put a dot at the point where it was 
        _penMove = function (pos, context) {
            if (_startPosition) {
                context.cursorLayer.setOffset(_startPosition.x - pos.x, _startPosition.y - pos.y);
                context.drawingLayer.setOffset(_startPosition.x - pos.x, _startPosition.y - pos.y);
                context.drawingLayer.draw();
            }
        },
        _penUp = function (pos) {
            _startPosition = null;
        };

        _init();

        return {
            cursor: _cursor,
            penDown: _penDown,
            penMove: _penMove,
            penUp: _penUp
        };
    })();
})(ViewModels.CanvasViewModel.Tools);