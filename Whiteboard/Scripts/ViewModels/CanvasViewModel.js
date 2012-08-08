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
           
            //the base object for event contexts
            _baseEventContext = {},

            //custom events - not sure if there's a better way to do this!
            _artifactAdded = ko.observable(),
            _artifactMoved = ko.observable(),

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

                 var drawingOffset = _drawingLayer.getOffset();

                _eventSink.setX(0);
                _eventSink.setY(0);
                _eventSink.setSize($container.width(), $container.height());
                _eventSink.setOffset(-drawingOffset.x, -drawingOffset.y); //make sure that the even sink always covers the screen
               
                _cursorLayer.add(_eventSink);
                _cursorLayer.draw();
            },

            //get the current position of the mouse/touch, taking offset into account
            _getCurrentPosition = function () {
                var pos = _stage.getUserPosition() || { x: 0, y: 0 },
                     currentOffset = _drawingLayer.getOffset();

                 return {
                     x: pos.x + currentOffset.x,
                     y: pos.y + currentOffset.y
                 };
             },

            //create the context passed to tools
            _createEventContext = function (evt) {
                return $.extend({
                    cursorLayer: _cursorLayer,
                    drawingLayer: _drawingLayer,
                    stage: _stage,
                    pos: _getCurrentPosition(),
                    artifact: evt != null ? evt.artifact : null
                },
                _baseEventContext);
            },

            //add the created artifact with a new view model
            _handleCreatedArtifact = function (newArtifact) {
                if (newArtifact) {
                    var vm = new ViewModels.ArtifactViewModel(newArtifact);
                    _artifactAdded(vm);
                    _artifacts.push(vm);
                    _localAddedArtifacts.push(vm);
                    return vm;
                }
            },
           
           //hook up the drag events on the event sink
            _hookUpDragEvents = function () {
                //helper function used for events that are just passed to the current tool
                var attachEventHandler = function (events, method, on) {
                    var handler = function(evt) {
                        if (_currentTool()[method]) {
                            var result = _currentTool()[method](_createEventContext(evt));
                            _handleCreatedArtifact(result);
                        }
                    };
                    for (var i = 0; i < on.length; i++) {
                        on[i].on(events, handler);
                    }
                }

                attachEventHandler("dblclick dbltap", "dblclick", [_drawingLayer, _eventSink]);
                attachEventHandler("click tap", "click", [_drawingLayer, _eventSink]);
                attachEventHandler("dragmove", "dragmove", [_drawingLayer]);
                attachEventHandler("click tap", "click", [_eventSink]);
                attachEventHandler("dragstart", "penDown", [_eventSink]);
                attachEventHandler("dragmove", "penMove", [_eventSink]);
                attachEventHandler("dragend mouseleave", "penUp", [_eventSink]);

                //drawing element dragend forwarded to tools
                _drawingLayer.on("dragend", function (evt) {
                    _artifactMoved(evt.artifact);
                });

                //reset the cursor layer when a drag ends
                _eventSink.on("dragend mouseleave", _resetCursorLayer);
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
                _availableTools.push(ViewModels.CanvasViewModel.Tools.Selector);
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
                $(window).on("resize orientationchange", function () {
                    _stage.setSize($container.width(), $container.height());
                    _resetCursorLayer();
                    _redrawArtifacts();
                });

                //load tools
                _loadTools();

                //when tool changes, reset cursor layer and notify the tool
                _currentTool.subscribe(function (selectedTool) {
                    _resetCursorLayer();
                    var context = _createEventContext();
                    for (var i = 0; i < _availableTools().length; i++) {
                        var tool = _availableTools()[i];
                        if (tool.selected && tool === selectedTool) {
                            tool.selected(context);
                        } else if (tool.unselected && tool !== selectedTool) {
                            tool.unselected(context);
                        }
                    }
                });
            };

        _init();

        //public members
        this.artifacts = _artifacts;
        this.artifactAdded = _artifactAdded;
        this.artifactMoved = _artifactMoved;
        this.availableTools = _availableTools;
        this.currentTool = _currentTool;
        this.selectTool = _selectTool;
        this.recenter = _recenter;
        this.localAddedArtifacts = _localAddedArtifacts;
        this.exportAsImage = _exportAsImage;
        this.addNewArtifact = _handleCreatedArtifact;
        this.baseEventContext = _baseEventContext;
    };

    ViewModels.CanvasViewModel.Tools = {};
})(jQuery, ko, window);