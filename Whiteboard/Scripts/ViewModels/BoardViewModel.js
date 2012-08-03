(function($, ko, window, undefined) {
    var ViewModels = (window.ViewModels = window.ViewModels || {});
    ViewModels.BoardViewModel = function (boardData) {
        if (!boardData) throw "Board data must be specified";
        var _name = ko.observable(boardData.Name);

        //public members
        this.name = _name;
    };

})(jQuery, ko, window);