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
            _startPosition = pos;
        },

        //save each point in the current drawing
        //and put a dot at the point where it was 
        _penMove = function (pos, context) {
            if (_startPosition) {
                var currentOffset = context.drawingLayer.getOffset(),
                    targetOffset = {
                        x: currentOffset.x + _startPosition.x - pos.x,
                        y: currentOffset.y + _startPosition.y - pos.y
                    };
                context.cursorLayer.setOffset(targetOffset);
                context.drawingLayer.setOffset(targetOffset);
                context.drawingLayer.draw();
            }
        },
        _penUp = function (pos, context) {
            var finalOffset = context.drawingLayer.getOffset(),
                finalWidth = context.stage.getWidth() + Math.abs(finalOffset.x),
                finalHeight = context.stage.getHeight() + Math.abs(finalOffset.y);

            context.stage.setSize(finalWidth, finalHeight);
            //context.cursorLayer.setSize(finalWidth, finalHeight);
            //context.drawingLayer.setSize(finalWidth, finalHeight);
            
            _startPosition = null;
        };

        _init();

        return {
            cursor: _cursor,
            penDown: _penDown,
            penMove: _penMove,
            penUp: _penUp,
            icon: "icon-move",
            name: "Pan Tool"
        };
    })();
})(ViewModels.CanvasViewModel.Tools);