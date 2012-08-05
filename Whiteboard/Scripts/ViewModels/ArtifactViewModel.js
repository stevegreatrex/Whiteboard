(function ($, ko, window, undefined) {
	var ViewModels = (window.ViewModels = window.ViewModels || {});

	ViewModels.ArtifactViewModel = function (artifact) {
		 var
            _self = this,

            _prepareArtifactFromServer = function (artifact) {
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
            },

			//clone the artifact data so we can modify it during a save
			_artifact = ko.observable(),

			//create the shape to render on the Kinetic surface
			_shape,

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

				//grab and clone the (possibly modified) artifact
				var artifactData = $.extend({}, true, _artifact());

                //can't serialize and HTMLImageElement, so remove it if it's there
				if (artifactData.Type === "Image" && artifactData.Data.image)
				    delete artifactData.Data.image;

                //set the string data
				artifactData.Data = JSON.stringify(artifactData.Data);

				return boardHub.saveArtifact(boardId, artifactData);
			}).done(function (updated) {
				_shape.setAlpha(1);
				_redraw();
				_prepareArtifactFromServer(updated);
				_artifact(updated);
			}),

            //initialize
			_init = function () {
			    _prepareArtifactFromServer(artifact);
			    _artifact($.extend({}, true, artifact));

			    //set up the shape
			    _shape = new Kinetic[_artifact().Type](_artifact().Data);
			    _shape.setDraggable(true);
			    _shape.on("dragend", function (evt) {
			        evt.artifact = _self;
                    
			        var layerOffset = _shape.getLayer().getOffset();
			        _artifact().Data.x = evt.layerX - (_shape.getWidth() / 2) + layerOffset.x;
			        _artifact().Data.y = evt.layerY - (_shape.getHeight() / 2) + layerOffset.y;
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