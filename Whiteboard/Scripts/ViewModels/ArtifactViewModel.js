(function ($, ko, window, undefined) {
	var ViewModels = (window.ViewModels = window.ViewModels || {});

	ViewModels.ArtifactViewModel = function (artifact) {
		//support either stringified or object data
		if (typeof artifact.Data === "string")
			artifact.Data = JSON.parse(artifact.Data);

		var
			//clone the artifact data so we can modify it during a save
			_artifact = ko.observable($.extend({}, true, artifact)),

			//create the shape to render on the Kinetic surface
			_shape = new Kinetic[_artifact().Type](_artifact().Data),

			//keep a record of the attached layer, if we have one
			_attachedLayer,
			_attachTo = function (layer) {
				_attachedLayer = layer;
			},

			//redraws this artifact, if possible
			_redraw = function () {
				if (_attachedLayer)
					_attachedLayer.draw();
			},
			
			//save this artifact
			_save = ko.command(function (boardHub, boardId) {
				//indicate visually that we're saving
				_shape.setAlpha(0.5);
				_redraw();

				//we have to send the data to the server as a string
				var artifactData = _artifact();
				artifactData.Data = JSON.stringify(artifactData.Data);

				return boardHub.addArtifact(boardId, artifactData);
			}).done(function (updated) {
				_shape.setAlpha(1);
				_redraw();
				_artifact(updated);
			});

		//public members
		this.shape = _shape;
		this.save = _save;
		this.artifact = _artifact;
		this.attachTo = _attachTo;
	};
})(jQuery, ko, window);