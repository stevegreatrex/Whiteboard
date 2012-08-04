$("body")
    .on("click.dropdown", ".dropdown input, .dropdown label, .dropdown select", function (e) {
        e.stopPropagation();
    });
