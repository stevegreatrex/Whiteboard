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

        _penDown = function (context) {
            _startPosition = context.pos;
        },

        //save each point in the current drawing
        //and put a dot at the point where it was 
        _penMove = function (context) {
            if (_startPosition) {
                var currentOffset = context.drawingLayer.getOffset(),
                    targetOffset = {
                        x: currentOffset.x + _startPosition.x - context.pos.x,
                        y: currentOffset.y + _startPosition.y - context.pos.y
                    };
                context.cursorLayer.setOffset(targetOffset);
                context.drawingLayer.setOffset(targetOffset);
                context.drawingLayer.draw();
            }
        },
        _penUp = function (context) {
            _startPosition = null;
        };

        _init();

        return {
            cursor: _cursor,
            penDown: _penDown,
            penMove: _penMove,
            penUp: _penUp,
            icon: "icon-move",
            name: "Pan Tool",
            cssCursor: "move"
        };
    })();
})(ViewModels.CanvasViewModel.Tools);