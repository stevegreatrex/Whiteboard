(function ($, ko, window, undefined) {
    var ViewModels = (window.ViewModels = window.ViewModels || {});
    ViewModels.CanvasViewModel = function (canvasId) {
        var $container = $("#" + canvasId),
            _stage = new Kinetic.Stage({
                container: canvasId,
                width: $container.width(),
                height: $container.height()
            }),
            _layer = new Kinetic.Layer();

        _stage.add(_layer);
    };

})(jQuery, ko, window);