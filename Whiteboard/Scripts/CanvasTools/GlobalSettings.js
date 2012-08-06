(function (Tools, ko) {
    Tools.GlobalSettings = {
        color: ko.observable("#000"),
        size: ko.observable(5)
    };
})(ViewModels.CanvasViewModel.Tools, ko);