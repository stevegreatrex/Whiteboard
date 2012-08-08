(function (Tools) {
    Tools.Selector = (function () {
        var
        
        _delete,

        _selectedArtifact = ko.observable(),

        _createDelete = function (context) {
            _delete = new Kinetic.Group()
            _delete.on("click tap", function (evt) {
                if (context && _selectedArtifact()) {
                    context.board.removeArtifact(_selectedArtifact());
                    var layer = _delete.getLayer();
                    _delete.hide();
                    layer.draw();
                    _selectedArtifact(null);
                }
                evt.stopPropagation();
                return false;
            });

            _delete.add(new Kinetic.Circle({
                fill: "red",
                radius: 10,
                listen: true
            }));
            _delete.add(new Kinetic.Line({
                stroke: "#fff",
                x: -5, y: -5,
                strokeWidth: 3,
                points: [ 1,1 , 9,9 , 5,5 , 1,9 , 9,1 ]
            }));

            return _delete;
        },

        _updateDeleteMarker = function (context) {

            if (!_delete) {
                _delete = _createDelete(context);
            }

            var shape = context.artifact.shape,
                x = shape.attrs.x,
                y = shape.attrs.y;

            if (shape.shapeType === "Ellipse") {
                x += shape.getRadius().x;
                y -= shape.getRadius().y;
            }

            if (shape.shapeType === "Rect") {
                x += shape.getWidth();
            }

            if (shape.shapeType === "Text") {
                x += shape.getBoxWidth() + 15;
            }

            _delete.setX(x);
            _delete.setY(y);
            context.cursorLayer.add(_delete);
            _delete.show();
            context.cursorLayer.draw();
        },
            
        //called when the tool is selected
        _selected = function (context) {
            //remove the event-absorbing layer so things can be draggable
            context.cursorLayer.removeChildren();
        },

        //called when the tool is unselected
        _unselected = function (context) {
            context.cursorLayer.remove(_delete);
            _delete = null;
        },

        _dragmove = function (context) {
            _selectedArtifact(context.artifact);
            _updateDeleteMarker(context);
        },
        
        //called when a shape is clicked
        _click = function (context) {
            _selectedArtifact(context.artifact);
            _updateDeleteMarker(context);
        };

        return {
            selected: _selected,
            unselected: _unselected,
            dragmove: _dragmove,
            click: _click,
            icon: "icon-hand-up",
            name: "Selector Tool"
        };
    })();
})(ViewModels.CanvasViewModel.Tools);