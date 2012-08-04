(function ($, ko, window, undefined) {
    var ViewModels = (window.ViewModels = window.ViewModels || {});

    ViewModels.ArtifactViewModel = function (artifact) {
        var _buildShape = function () {
            return new Kinetic[artifact.Type](JSON.parse(artifact.Data));
        };

        this.buildShape = _buildShape;
    };

    ViewModels.CanvasViewModel = function (canvasId) {
        var $container = $("#" + canvasId),
            //kinetic setup
            _stage = new Kinetic.Stage({
                container: canvasId,
                width: $container.width(),
                height: $container.height()
            }),
            _layer = new Kinetic.Layer(),

            //artifacts
            _artifacts = ko.observableArray(),
                
            //init
            _init = function () {
                _stage.add(_layer);

                _artifacts.subscribe(function (newValue) {
                    _layer.removeChildren();
                    for (var i = 0; i < newValue.length; i++) {
                        (function (item) {
                            _layer.add(item.buildShape());
                        })(newValue[i]);
                    }
                    _layer.draw();
                });
            };

        _init();

        //public members
        this.artifacts = _artifacts;
    };

})(jQuery, ko, window);