(function ($, window, undefined) {
    window.Api = function (siteRoot) {
        var _url = siteRoot + "api/BoardApi/",

            _setBoardName = function (boardId, boardName) {
                return $.post(_url + "SetBoardName?boardId=" + boardId + "&boardName=" + boardName);
            };

        this.setBoardName = _setBoardName;
    };
})(jQuery, window);