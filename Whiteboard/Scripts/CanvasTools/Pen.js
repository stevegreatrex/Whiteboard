(function (Tools) {
    Tools.Pen = (function () {
        var
            //keep a record of all points in the current line
            _currentDrawingPoints = [],

            //the line drawn whilst the mouse/touch is down
            _tempLine,

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

        //generates the line data for either the temporary or confirmed line
        _getLineData = function () {
            return {
                strokeWidth: _size(),
                stroke: _color(),
                points: _currentDrawingPoints,
                lineCap: "round"
            }
        },
        
        //reset the current drawing when the pen goes down
        _penDown = function (pos, context) {
            _currentDrawingPoints = [pos];
            _tempLine = new Kinetic.Line(_getLineData());
            context.cursorLayer.add(_tempLine);
        },

        //save each point in the current drawing
        //and put a dot at the point where it was 
        _penMove = function (pos, context) {
            _currentDrawingPoints.push(pos);
        },
        _penUp = function (pos) {
            if (_currentDrawingPoints.length) {
                return {
                    Type: "Line",
                    Data: _getLineData()
                };
            }
        };

        _init();

        return {
            cursor: _cursor,
            penDown: _penDown,
            penMove: _penMove,
            penUp: _penUp,
            icon: "icon-pencil",
            name: "Pen Tool"
        };
    })();
})(ViewModels.CanvasViewModel.Tools);