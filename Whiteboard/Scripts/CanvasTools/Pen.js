(function (Tools, GlobalSettings) {
    Tools.Pen = (function () {
        var
        //keep a record of all points in the current line
        _currentDrawingPoints = [],

        //the line drawn whilst the mouse/touch is down
        _tempLine,

           
        
        _init = function () {
            
        },

        //generates the line data for either the temporary or confirmed line
        _getLineData = function () {
            return {
                strokeWidth: GlobalSettings.size(),
                stroke: GlobalSettings.color(),
                points: _currentDrawingPoints,
                lineCap: "round"
            }
        },
        
        //reset the current drawing when the pen goes down
        _penDown = function (context) {
            _currentDrawingPoints = [context.pos];
            _tempLine = new Kinetic.Line(_getLineData());
            context.cursorLayer.add(_tempLine);
        },

        //save each point in the current drawing
        //and put a dot at the point where it was 
        _penMove = function (context) {
            _currentDrawingPoints.push(context.pos);
        },
        _penUp = function (context) {
            if (_currentDrawingPoints.length) {
                return {
                    Type: "Line",
                    Data: _getLineData(),
                    detectionType: "pixel"
                };
            }
        };

        _init();

        return {
            penDown: _penDown,
            penMove: _penMove,
            penUp: _penUp,
            icon: "icon-pencil",
            name: "Pen Tool",
            color: GlobalSettings.color,
            options: [
                { name: "Color", editor: "color-editor", value: GlobalSettings.color },
                { name: "Pen Size", editor: "pen-size-editor", value: GlobalSettings.size }
            ]
        };
    })();
})(ViewModels.CanvasViewModel.Tools, ViewModels.CanvasViewModel.Tools.GlobalSettings);