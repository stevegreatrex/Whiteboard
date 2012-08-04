(function (Tools) {
    Tools.Ellipse = (function () {
        var
           //the circle drawn whilst the mouse/touch is down
            _tempCircle,

            //line color
            _color = ko.observable("#000"),

            //line size
            _size = ko.observable(5),

            //invisible cursor
            _cursor = new Kinetic.Circle({
                strokeWidth: 0,
                radius: 0
            }),

            //keep a record of the point the pen went down
            _startPos,

            //generates the circle data for either the temporary or confirmed line
            _getCircleData = function (currentPosition) {
                var halfSize = {
                    width: (currentPosition.x - _startPos.x) / 2,
                    height: (currentPosition.y - _startPos.y) / 2
                },
                center = {
                    x: _startPos.x + halfSize.width,
                    y: _startPos.y + halfSize.height
                };

                return {
                    strokeWidth: _size(),
                    stroke: _color(),
                    x: center.x,
                    y: center.y,
                    radius: {
                        x: Math.abs(halfSize.width),
                        y: Math.abs(halfSize.height)
                    }
                }
            },
        
            //reset the current drawing when the pen goes down
            _penDown = function (pos, context) {
                _startPos = pos;
                _tempCircle = new Kinetic.Ellipse(_getCircleData(pos));
                context.cursorLayer.add(_tempCircle);
            },

            //save each point in the current drawing
            //and put a dot at the point where it was 
            _penMove = function (pos, context) {
                var updatedData = _getCircleData(pos);
                _tempCircle.setRadius(updatedData.radius);
                _tempCircle.setX(updatedData.x);
                _tempCircle.setY(updatedData.y);
            },
            _penUp = function (pos) {
                if (_startPos) {
                    return {
                        Type: "Ellipse",
                        Data: _getCircleData(pos)
                    };
                }
            };

        return {
            cursor: _cursor,
            penDown: _penDown,
            penMove: _penMove,
            penUp: _penUp,
            icon: "icon-play-circle",
            name: "Circle Tool",
            color: _color,
            options: [
                { name: "Color", editor: "color-editor", value: _color },
                { name: "Stroke Width", editor: "pen-size-editor", value: _size }
            ]
        };
    })();
})(ViewModels.CanvasViewModel.Tools);