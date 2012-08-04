(function ($, ko, window, undefined) {
    var ViewModels = (window.ViewModels = window.ViewModels || {});

    ViewModels.CanvasViewModel = function (canvasId) {
        var _self = this,
            $container = $("#" + canvasId),
            //kinetic setup
            _stage = new Kinetic.Stage({
                container: canvasId,
                width: $container.width(),
                height: $container.height()
            }),
            _drawingLayer = new Kinetic.Layer(),
            _cursorLayer = new Kinetic.Layer(),
            _eventSink = new Kinetic.Rect({
                width: $container.width(),
                height: $container.height(),
                draggable: true
            }),
            _cursor,

            //custom events - not sure if there's a better way to do this!
            _artifactAdded = ko.observable(),

            //tools
            _currentTool = ko.observable(ViewModels.CanvasViewModel.Tools.Pen),

            //artifacts
            _artifacts = ko.observableArray(),

            //reset the cursor layer after a draw has completed
            _resetCursorLayer = function () {
                _cursorLayer.removeChildren();

                _cursor = _currentTool().cursor;

                _eventSink.setX(0);
                _eventSink.setY(0);
                _cursor.setAlpha(0);
                _cursorLayer.add(_cursor);
                _cursorLayer.add(_eventSink);
                _cursorLayer.draw();
            },

            //hook up the drag events on the event sink
            _createEventContext = function () {
                return {
                    cursorLayer: _cursorLayer,
                    drawingLayer: _drawingLayer
                }
            },
            _hookUpDragEvents = function () {
                _eventSink.on("dragstart", function (e) {
                    var pos = _stage.getUserPosition();
                    _cursor.setAlpha(1);
                    _currentTool().penDown(pos, _createEventContext());
                    _cursorLayer.draw();
                });

                _eventSink.on("dragmove", function (e) {
                    var pos = _stage.getUserPosition();
                    _cursor.setX(pos.x);
                    _cursor.setY(pos.y);

                    _currentTool().penMove(pos, _createEventContext());
                    _cursorLayer.draw();
                });

                _eventSink.on("dragend", function (e) {
                    var pos = _stage.getUserPosition();
                    var newArtifact = _currentTool().penUp(pos, _artifacts);

                    if (newArtifact) {
                        var vm = new ViewModels.ArtifactViewModel(newArtifact);
                        _artifactAdded(vm);
                        _artifacts.push(vm);
                    }

                    _resetCursorLayer();
                });
            },

            //redraw all artifacts
            _redrawArtifacts = function () {
                _drawingLayer.removeChildren();
                var children = _artifacts();
                for (var i = 0; i < children.length; i++) {
                    (function (item) {
                        item.attachTo(_drawingLayer);
                        _drawingLayer.add(item.shape);
                    })(children[i]);
                }
                _drawingLayer.draw();
            },

            //init
            _init = function () {
                //prevent selection on the canvas to avoid strange cursors on desktop
                $container[0].onselectstart = function () { return false; };
                _stage.add(_drawingLayer);
                _stage.add(_cursorLayer);

                //reset the cursor layer
                _resetCursorLayer();
                
                //redraw artifacts layer whenever artifacts are updated
                _artifacts.subscribe(_redrawArtifacts);

                //hook up drag events
                _hookUpDragEvents();

                $(window).resize(function () {
                    _stage.setSize($container.width(), $container.height());
                    _redrawArtifacts();
                });
            };

        _init();

        //public members
        this.artifacts = _artifacts;
        this.artifactAdded = _artifactAdded;
    };

    ViewModels.CanvasViewModel.Tools = {};
})(jQuery, ko, window);