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
            _availableTools = ko.observableArray(),
            _currentTool = ko.observable(ViewModels.CanvasViewModel.Tools.Pen),

            //artifacts
            _artifacts = ko.observableArray(),
            _localAddedArtifacts = ko.observableArray(),

            //re-centers the view
            _recenter = function () {
                _drawingLayer.setOffset(0, 0);
                _cursorLayer.setOffset(0, 0);
                _drawingLayer.draw();
                _resetCursorLayer();
            },

            //reset the cursor layer after a draw has completed
            _resetCursorLayer = function () {
                _cursorLayer.removeChildren();

                _cursor = _currentTool().cursor;

                var drawingOffset = _drawingLayer.getOffset();

                _eventSink.setX(0);
                _eventSink.setY(0);
                _eventSink.setOffset(-drawingOffset.x, -drawingOffset.y); //make sure that the even sink always covers the screen
                _cursor.setAlpha(0);
                _cursorLayer.add(_cursor);
                _cursorLayer.add(_eventSink);
                _cursorLayer.draw();
            },

            //get the current position of the mouse/touch, taking offset into account
            _getCurrentPosition = function () {
                 var pos = _stage.getUserPosition(),
                     currentOffset = _drawingLayer.getOffset();

                 return {
                     x: pos.x + currentOffset.x,
                     y: pos.y + currentOffset.y
                 };
             },

            //create the context passed to tools
            _createEventContext = function () {
                return {
                    cursorLayer: _cursorLayer,
                    drawingLayer: _drawingLayer,
                    stage: _stage
                }
            },

            _handleCreatedArtifact = function (newArtifact) {
                if (newArtifact) {
                    var vm = new ViewModels.ArtifactViewModel(newArtifact);
                    _artifactAdded(vm);
                    _artifacts.push(vm);
                    _localAddedArtifacts.push(vm);
                }
            },
           
            //hook up the drag events on the event sink
            _hookUpDragEvents = function () {
                _eventSink.on("click dbltap", function (e) {
                    if (_currentTool().click) {
                        var pos = _getCurrentPosition();
                        _handleCreatedArtifact(_currentTool().click(pos, _createEventContext()));
                    }
                });

                _eventSink.on("dragstart", function (e) {
                    if (_currentTool().penDown) {
                        var pos = _getCurrentPosition();
                        _cursor.setAlpha(1);
                        _currentTool().penDown(pos, _createEventContext());
                        _cursorLayer.draw();
                    }
                });

                _eventSink.on("dragmove", function (e) {
                    if (_currentTool().penMove) {
                        var pos = _getCurrentPosition();
                        _cursor.setX(pos.x);
                        _cursor.setY(pos.y);

                        _currentTool().penMove(pos, _createEventContext());
                        _cursorLayer.draw();
                    }
                });

                _eventSink.on("dragend mouseleave", function (e) {
                    if (_currentTool().penUp) {
                        var pos = _getCurrentPosition();
                        _handleCreatedArtifact(_currentTool().penUp(pos, _createEventContext()));                      
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

            //populate the available tools
            _loadTools = function () {
                _availableTools.push(ViewModels.CanvasViewModel.Tools.Pan);
                _availableTools.push(ViewModels.CanvasViewModel.Tools.Pen);
                _availableTools.push(ViewModels.CanvasViewModel.Tools.Ellipse);
                _availableTools.push(ViewModels.CanvasViewModel.Tools.Rect);
                _availableTools.push(ViewModels.CanvasViewModel.Tools.Text);
            },

            //select a tool
            _selectTool = function (tool) {
                _currentTool(tool);
            },

            //open an image rendering of the canvas in another window
            _exportAsImage = function () {
                _stage.toDataURL({
                    callback: function (url) {
                        window.open(url);
                    }
                })
                
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

                //handle window resizing
                $(window).resize(function () {
                    _stage.setSize($container.width(), $container.height());
                    _redrawArtifacts();
                });

                //load tools
                _loadTools();
            };

        _init();

        //public members
        this.artifacts = _artifacts;
        this.artifactAdded = _artifactAdded;
        this.availableTools = _availableTools;
        this.currentTool = _currentTool;
        this.selectTool = _selectTool;
        this.recenter = _recenter;
        this.localAddedArtifacts = _localAddedArtifacts;
        this.exportAsImage = _exportAsImage;
    };

    ViewModels.CanvasViewModel.Tools = {};
})(jQuery, ko, window);