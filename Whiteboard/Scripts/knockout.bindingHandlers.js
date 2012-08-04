ko.bindingHandlers.loadingWhen = {
	init: function (element, valueAccessor, allBindingsAccessor) {
		var loaderClass = ko.utils.unwrapObservable(allBindingsAccessor()).loaderClass || "loader-white",
			$element = $(element),
			currentPosition = $element.css("position")
			$loader = $("<div>", { class: loaderClass }).addClass("loader").hide();

		//add the loader
		$element.append($loader);
		
		//make sure that we can absolutely position the loader against the original element
		if (currentPosition == "auto" || currentPosition == "static")
			$element.css("position", "relative");

		//center the loader
		$loader.css({
			position: "absolute",
			top: "50%",
			left: "50%",
			"margin-left": -($loader.width() / 2) + "px",
			"margin-top": -($loader.height() / 2) + "px"
		});
	},
	update: function (element, valueAccessor) {
		var isLoading = ko.utils.unwrapObservable(valueAccessor()),
			$element = $(element),
			$childrenToHide = $element.children(":not(div.loader)"),
			$loader = $element.find("div.loader");

		if (isLoading) {
			$childrenToHide.css("visibility", "hidden").attr("disabled", "disabled");
			$loader.show();
		}
		else {
			$loader.fadeOut("fast");
			$childrenToHide.css("visibility", "visible").removeAttr("disabled");
		}
	}
};

ko.bindingHandlers.confirmDeleteButton = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(),
			$element = $(element)
				.click(function () {
				    $element.hide();
				    $warning.show();
				    $confirm.show();
				    $cancel.show();
				    return false;
				}),
			$confirm = $("<a />")
				.text(value.confirmCaption || "Confirm")
				.addClass("btn btn-danger btn-mini confirm-button")
				.hide()
				.click(function (event) {
				    value.action.call(this, viewModel, event);
				    $cancel.hide();
				    $warning.hide();
				    $confirm.hide();
				    $element.show();
				}),
			$cancel = $("<a>Cancel</a>")
				.addClass("btn btn-mini cancel-button")
				.hide()
				.click(function () {
				    $cancel.hide();
				    $warning.hide();
				    $confirm.hide();
				    $element.show();
				    return false;
				}),
			$warning = $("<p/>")
				.addClass("warning-message")
				.hide();

        $element.after($cancel);
        $element.after($confirm);

        if (value.warning) {
            $warning.text(value.warning);
            $element.after($warning);
        }
    }
};