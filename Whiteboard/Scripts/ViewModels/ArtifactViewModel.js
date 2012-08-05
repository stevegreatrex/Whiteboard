(function ($, ko, window, undefined) {
	var ViewModels = (window.ViewModels = window.ViewModels || {});

	ViewModels.ArtifactViewModel = function (artifact) {
		//support either stringified or object data
		if (typeof artifact.Data === "string")
		    artifact.Data = JSON.parse(artifact.Data);

	    //if the artifact is an image, we need to deserialize the data
		if (artifact.Type === "Image") {
		    var image = new Image();
		    image.src = artifact.Data.imageUri;
		    image.onload = function () {
		        _artifact().Data.width = image.width;
		        _artifact().Data.height = image.height;
		        _redraw();
		    };
		    artifact.Data.image = image;
		}

	    var
            _self = this,

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

				//grab the (possibly modified) artifact
				var artifactData = _artifact();

                //can't serialize and HTMLImageElement, so remove it if it's there
				if (artifactData.Type === "Image" && artifactData.Data.image)
				    delete artifactData.Data.image;

                //set the string data
				artifactData.Data = JSON.stringify(artifactData.Data);

				return boardHub.saveArtifact(boardId, artifactData);
			}).done(function (updated) {
				_shape.setAlpha(1);
				_redraw();
				_artifact(updated);
			}),

            //initialize
			_init = function () {
			    _shape.setDraggable(true);
			    _shape.on("dragend", function (evt) {
			        evt.artifact = _self;
			        _artifact().Data.x = evt.x;
			        _artifact().Data.y = evt.y;
			    });
			};

		_init();

		//public members
		this.shape = _shape;
		this.save = _save;
		this.artifact = _artifact;
		this.attachTo = _attachTo;
	};
})(jQuery, ko, window);