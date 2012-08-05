(function (Tools) {
    Tools.Selector = (function () {
        var
        //hidden cursor
        _cursor = new Kinetic.Circle({
            strokeWidth: 0,
            radius: 0
        }),

        //initialize
        _init = function () {
        },
            
        //called when the tool is selected
        _selected = function (context) {
            //remove the event-absorbing layer so things can be draggable
            context.cursorLayer.removeChildren();
        };

        _init();

        return {
            selected: _selected,
            cursor: _cursor,
            icon: "icon-hand-up",
            name: "Selector Tool"
        };
    })();
})(ViewModels.CanvasViewModel.Tools);