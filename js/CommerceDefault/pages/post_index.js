"use strict";



document.addEventListener("DOMContentLoaded",
    function () {
        initPostIndex();
        lazyLoadRating();
    });

function initPostIndex() {

}

function lazyLoadRating() {
    document.getElementById("btnReloadRatings").click();
}
