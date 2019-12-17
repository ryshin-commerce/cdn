var btnSearchProductName;

document.addEventListener("DOMContentLoaded",
    function () {
    });



function processAnonymousUser() {
    var canvases = document.querySelectorAll("[rating-id] canvas");

    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];

        var name = canvas.dataset.userName,
            nameSplit = name.split(" "),
            initials = nameSplit.length > 2 ? nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase() : nameSplit[0].charAt(0).toUpperCase();


        var context = canvas.getContext("2d");

        var canvasCssWidth = canvas.width,
            canvasCssHeight = canvas.height;

        if (window.devicePixelRatio) {
            canvas.setAttribute("width", canvasCssWidth * window.devicePixelRatio);
            canvas.setAttribute("height", canvasCssHeight * window.devicePixelRatio);
            canvas.style.width = canvasCssWidth + "px";
            canvas.style.height = canvasCssHeight + "px";
            context.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        context.fillStyle = stringToHslColor(initials, 30, 80);
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = (canvasCssHeight / 2) + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);
    }
}


function stringToHslColor(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

