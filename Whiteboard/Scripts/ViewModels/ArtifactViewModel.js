(function ($, ko, window, undefined) {
	var ViewModels = (window.ViewModels = window.ViewModels || {});

	ViewModels.ArtifactViewModel = function (artifact) {
		//support either stringified or object data
		if (typeof artifact.Data === "string")
			artifact.Data = JSON.parse(artifact.Data);

		//create the shape to render on the Kinetic surface
		var _buildShape = function () {
			return new Kinetic[artifact.Type](artifact.Data);
		};

		this.buildShape = _buildShape;
	};
})(jQuery, ko, window);