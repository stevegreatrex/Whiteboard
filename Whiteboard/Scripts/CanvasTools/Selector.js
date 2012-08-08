﻿(function (Tools) {
    Tools.Selector = (function () {
        var
        //hidden cursor
        _cursor = new Kinetic.Circle({
            strokeWidth: 0,
            radius: 0
        }),

        _delete = new Kinetic.Group(),

        _currentBoard,

        _selectedArtifact = ko.observable(),

        //initialize
        _init = function () {
            _delete.on("click tap", function (evt) {
                if (_currentBoard && _selectedArtifact()) {
                    _currentBoard.removeArtifact(_selectedArtifact());
                    var layer = _delete.getLayer();
                    layer.remove(_delete);
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
        },

        _updateDeleteMarker = function (context) {
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
        },

        _dragmove = function (context) {
            _selectedArtifact(context.artifact);
            _currentBoard = context.board;
            _updateDeleteMarker(context);
        },
        
        //called when a shape is clicked
        _click = function (context) {
            _selectedArtifact(context.artifact);
            _currentBoard = context.board;
            _updateDeleteMarker(context);
        };

        _init();

        return {
            selected: _selected,
            unselected: _unselected,
            dragmove: _dragmove,
            click: _click,
            cursor: _cursor,
            icon: "icon-hand-up",
            name: "Selector Tool"
        };
    })();
})(ViewModels.CanvasViewModel.Tools);