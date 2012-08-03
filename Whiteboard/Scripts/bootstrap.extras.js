$("body")
    .on("click.dropdown", ".dropdown input, .dropdown label", function (e) {
        e.stopPropagation();
    });
