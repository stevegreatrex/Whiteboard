﻿(function($, ko, window, undefined) {
    var ViewModels = (window.ViewModels = window.ViewModels || {});
    ViewModels.BoardViewModel = function (api, boardData) {
        if (!boardData) throw "Board data must be specified";

        var
            //board name
            _name = ko.observable(boardData.Name),
            _isEditingName = ko.observable(false),
            _beginEditName = function () {
                _isEditingName(true);
            },
            _saveName = ko.command(function () {
                return api.setBoardName(boardData.Id, _name());
            }).done(function() {
                _isEditingName(false);
            });


        //public members
        this.name = _name;
        this.isEditingName = _isEditingName;
        this.beginEditName = _beginEditName;
        this.saveName = _saveName;
    };

})(jQuery, ko, window);