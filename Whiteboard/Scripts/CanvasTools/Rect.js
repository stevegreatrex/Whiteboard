(function (Tools) {
    Tools.Rect = (function () {
        var
           //the Rect drawn whilst the mouse/touch is down
            _tempRect,

            //line color
            _color = ko.observable("#000"),

            //line size
            _size = ko.observable(5),

            //invisible cursor
            _cursor = new Kinetic.Rect({
                strokeWidth: 0,
                radius: 0
            }),

            //keep a record of the point the pen went down
            _startPos,

            //generates the Rect data for either the temporary or confirmed line
            _getRectData = function (currentPosition) {
                return {
                    strokeWidth: _size(),
                    stroke: _color(),
                    x: _startPos.x,
                    y: _startPos.y,
                    width: (currentPosition.x - _startPos.x),
                    height: (currentPosition.y - _startPos.y)
                }
            },

            //reset the current drawing when the pen goes down
            _penDown = function (pos, context) {
                _startPos = pos;
                _tempRect = new Kinetic.Rect(_getRectData(pos));
                context.cursorLayer.add(_tempRect);
            },

            //save each point in the current drawing
            //and put a dot at the point where it was 
            _penMove = function (pos, context) {
                var updatedData = _getRectData(pos);
                _tempRect.setSize(updatedData.width, updatedData.height);
                _tempRect.setX(updatedData.x);
                _tempRect.setY(updatedData.y);
            },
            _penUp = function (pos) {
                if (_startPos) {
                    return {
                        Type: "Rect",
                        Data: _getRectData(pos)
                    };
                }
            };

        return {
            cursor: _cursor,
            penDown: _penDown,
            penMove: _penMove,
            penUp: _penUp,
            icon: "icon-stop",
            name: "Rectangle Tool",
            color: _color,
            options: [
                { name: "Color", editor: "color-editor", value: _color },
                { name: "Stroke Width", editor: "pen-size-editor", value: _size }
            ]
        };
    })();
})(ViewModels.CanvasViewModel.Tools);