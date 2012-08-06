$("body")
    .on("click.dropdown", ".dropdown input, .dropdown label, .dropdown select, .dropdown .clickable", function (e) {
        e.stopPropagation();
    });
