(function (Tools) {
    Tools.Text = (function () {
        var
            //text color
            _color = ko.observable("#000"),

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
                    textFill: _color(),
                }
            },

            _click = function (pos) {
                var enteredText = prompt("Enter Text");
                if (enteredText) {
                    return {
                        Type: "Text",
                        Data: _getTextData(pos, enteredText)
                    };
                }
            };

        return {
            cursor: _cursor,
            click: _click,
            icon: "icon-font",
            name: "Text Tool",
            color: _color,
            options: [
                { name: "Color", editor: "color-editor", value: _color },
                { name: "Font Family", editor: "font-family-editor", value: _fontFamily },
                { name: "Font Size", editor: "font-size-editor", value: _fontSize }
            ]
        };
    })();
})(ViewModels.CanvasViewModel.Tools);