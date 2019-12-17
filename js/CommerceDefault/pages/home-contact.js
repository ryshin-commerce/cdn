"use strict";
var imageCaptcha;

document.addEventListener("DOMContentLoaded",
    function () {
        init();
        //contact
        imageCaptcha = document.querySelector("[data-captcha-container] ._image-wrap");

        if (!!imageCaptcha) {
            imageCaptcha.addEventListener("click", function (e) {
                reloadImage();
            });
        }
        
    });

function init() {
  
};

function lazyloadCategoriesProduct(containerElement, tabNumber) {
    var submitFormButton = containerElement.querySelector("form button");
    submitFormButton.click();

    submitFormButton.onclick = function () {
        //do what you want;
        return false;
    };
};
//contact
function clearform() {
    $('#frmContact')[0].reset();
}

function reloadImage() {
    var d = new Date();
    $("#img-captcha").attr("src", "/get-captcha-image?" + d.getTime());
}


function initMap() {
    var mapContainer = document.getElementById('mapContainer');
    var myLatLng = { lat: +mapContainer.dataset.lat, lng: +mapContainer.dataset.lng };

    // Create a map object and specify the DOM element
    // for display.
    var map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: myLatLng,
        zoom: 15,
        disableDefaultUI: true
    });

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
        map: map,
        position: myLatLng,
        title: mapContainer.dataset.title
    });
}