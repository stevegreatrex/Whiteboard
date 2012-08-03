(function($, ko, window, undefined) {
    var ViewModels = (window.ViewModels = window.ViewModels || {});
    ViewModels.BoardViewModel = function (hub, boardData) {
        if (!boardData) throw "Board data must be specified";

        var
            //board name
            _name = ko.observable(boardData.Name),
            _isEditingName = ko.observable(false),
            _beginEditName = function () {
                _isEditingName(true);
            },
            _saveName = ko.command(function () {
                return hub.renameBoard(boardData.Id, _name());
            }).done(function() {
                _isEditingName(false);
            }),
            
            _init = function () {
                hub.boardRenamed = function (boardId, newName) {
                    if (boardId === boardData.Id) {
                        _name(newName);
                    }
                };
            };

        _init();

        //public members
        this.name = _name;
        this.isEditingName = _isEditingName;
        this.beginEditName = _beginEditName;
        this.saveName = _saveName;
    };

})(jQuery, ko, window);