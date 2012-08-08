(function (Tools, ko) {
    Tools.GlobalSettings = {
        color: ko.observable("#000"),
        size: ko.observable(5),
        fill: ko.observable()
    };
})(ViewModels.CanvasViewModel.Tools, ko);