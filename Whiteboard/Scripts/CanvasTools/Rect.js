(function (Tools, GlobalSettings) {
    Tools.Rect = (function () {
        var
           //the Rect drawn whilst the mouse/touch is down
            _tempRect,

            //invisible cursor
            _cursor = new Kinetic.Rect({
                strokeWidth: 0,
                radius: 0
            }),

            //keep a record of the point the pen went down
            _startPos,

            //generates the Rect data for either the temporary or confirmed line
            _getRectData = function (currentPosition) {
                var data = {
                    strokeWidth: GlobalSettings.size(),
                    stroke: GlobalSettings.color(),
                    x: _startPos.x,
                    y: _startPos.y,
                    width: (currentPosition.x - _startPos.x),
                    height: (currentPosition.y - _startPos.y)
                };

                if (GlobalSettings.fill()) {
                    data.fill = GlobalSettings.fill();
                }

                return data;
            },

            //reset the current drawing when the pen goes down
            _penDown = function (context) {
                _startPos = context.pos;
                _tempRect = new Kinetic.Rect(_getRectData(context.pos));
                context.cursorLayer.add(_tempRect);
            },

            //save each point in the current drawing
            //and put a dot at the point where it was 
            _penMove = function (context) {
                var updatedData = _getRectData(context.pos);
                _tempRect.setSize(updatedData.width, updatedData.height);
                _tempRect.setX(updatedData.x);
                _tempRect.setY(updatedData.y);
            },
            _penUp = function (context) {
                if (_startPos) {
                    return {
                        Type: "Rect",
                        Data: _getRectData(context.pos)
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
            color: GlobalSettings.color,
            options: [
                { name: "Color", editor: "color-editor", value: GlobalSettings.color },
                { name: "Fill Color", editor: "fill-color-editor", value: GlobalSettings.fill },
                { name: "Stroke Width", editor: "pen-size-editor", value: GlobalSettings.size }
            ]
        };
    })();
})(ViewModels.CanvasViewModel.Tools, ViewModels.CanvasViewModel.Tools.GlobalSettings);