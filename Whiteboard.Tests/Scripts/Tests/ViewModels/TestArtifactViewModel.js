module("Artifact View Model Tests");

var createMockArtifact = function (type) {
    var artifact = {
        Type: type || "Line",
        Data:{
            x: 123,
            y: 456
        }
    };
    
    artifact.Data = JSON.stringify(artifact.Data);

    return artifact;
};

test("Throws if no artifact specified", function () {
    raises(function () {
        new ViewModels.ArtifactViewModel(null);
    }, /Must specify artifact/);
});

test("artifact returns clone of constructor-specified artifact", function () {
    var artifact = createMockArtifact(),
        testSubject = new ViewModels.ArtifactViewModel(artifact);

    deepEqual(testSubject.artifact(), artifact, "The artifact should be a clone of the original");
    notEqual(testSubject.artifact(), artifact, "The artifact should be a CLONE of the original, not THE original");
});

test("artifact parses string data", function () {
    var artifact = createMockArtifact(),
       testSubject = new ViewModels.ArtifactViewModel(artifact);

    equal(typeof testSubject.artifact().Data, "object", "The stringified artifact data should have been parsed");
    equal(testSubject.artifact().Data.x, 123, "The stringified artifact data should have been parsed");
    equal(testSubject.artifact().Data.y, 456, "The stringified artifact data should have been parsed");
});

test("basic shapes are created", function () {
    var line = new ViewModels.ArtifactViewModel(createMockArtifact("Line")),
        rect = new ViewModels.ArtifactViewModel(createMockArtifact("Rect")),
        circle = new ViewModels.ArtifactViewModel(createMockArtifact("Circle"));

    ok(line.shape, "The shape should have been set");
    ok(rect.shape, "The shape should have been set");
    ok(circle.shape, "The shape should have been set");

    equal(line.shape.shapeType, "Line", "The shape should have been created in the correct type");
    equal(line.shape.attrs.x, 123, "The shape data should have been set");
    equal(line.shape.attrs.y, 456, "The shape data should have been set");
});