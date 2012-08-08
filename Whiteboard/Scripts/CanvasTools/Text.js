(function (Tools, GlobalSettings) {
    Tools.Text = (function () {
        var
            //font size
            _fontSize = ko.observable(12),

            //font family
            _fontFamily = ko.observable("Segoe UI"),

            //invisible cursor
            _cursor = new Kinetic.Circle({
                strokeWidth: 0,
                radius: 0
            }),

           //generates the text area
            _getTextData = function (pos, text) {
                return {
                    x: pos.x,
                    y: pos.y,
                    text: text,
                    fontSize: _fontSize(),
                    fontFamily: _fontFamily(),
                    textFill: GlobalSettings.color(),
                }
            },

            _dblclick = function (context) {
                var enteredText = prompt("Enter Text");
                if (enteredText) {
                    return {
                        Type: "Text",
                        Data: _getTextData(context.pos, enteredText)
                    };
                }
            };

        return {
            cursor: _cursor,
            dblclick: _dblclick,
            icon: "icon-font",
            name: "Text Tool",
            color: GlobalSettings.color,
            options: [
                { name: "Color", editor: "color-editor", value: GlobalSettings.color },
                { name: "Font Family", editor: "font-family-editor", value: _fontFamily },
                { name: "Font Size", editor: "font-size-editor", value: _fontSize }
            ]
        };
    })();
})(ViewModels.CanvasViewModel.Tools, ViewModels.CanvasViewModel.Tools.GlobalSettings);