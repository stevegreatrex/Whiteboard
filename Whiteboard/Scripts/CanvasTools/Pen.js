(function (Tools) {
    Tools.Pen = (function () {
        var
            //keep a record of all points in the current line
            _currentDrawingPoints = [],

            //line color
            _color = ko.observable("#000"),

            //line size
            _size = ko.observable(5),

            //simple cursor
            _cursor = new Kinetic.Circle({
                strokeWidth: 2
            }),

            //update cursor with size and color
            _updateCursor = function () {
                _cursor.setRadius(_size());
                _cursor.setStroke(_color());
            },
           
           //hook up event listeners on color & size
        _init = function () {
            _size.subscribe(_updateCursor);
            _color.subscribe(_updateCursor);
        },
        
        //reset the current drawing when the pen goes down
        _penDown = function (pos, cursorLayer) {
            _currentDrawingPoints = [];
        },

        //save each point in the current drawing
        //and put a dot at the point where it was 
        _penMove = function (pos, cursorLayer) {
            cursorLayer.add(new Kinetic.Circle({
                x: pos.x,
                y: pos.y,
                radius: _size(),
                fill: _color()
            }));
            _currentDrawingPoints.push(pos);
        },
        _penUp = function (pos) {
            if (_currentDrawingPoints.length)
                return {
                    Type: "Line",
                    Data: {
                        points: _currentDrawingPoints,
                        strokeWidth: _size(),
                        stroke: _color()
                    }
                };
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