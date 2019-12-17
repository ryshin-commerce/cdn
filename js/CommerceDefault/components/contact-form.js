"use strict";
var imageCaptcha, fileUploadNewReview, imputDocumentFile;

function initContactForm() {
    imageCaptcha = document.querySelector("[data-captcha-container] ._image-wrap");

    if (!!imageCaptcha) {
        imageCaptcha.addEventListener("click", function (e) {
            reloadImage();
        });
    }
}

function innitFileUpload() {
    //----------------
    //----------------
    imputDocumentFile = document.getElementById("inputDetailFromFile");

    const curentImageContactFilePath = !!imputDocumentFile.dataset.curentPathFiles && imputDocumentFile.dataset.curentPathFiles !== ""
        ? [imputDocumentFile.dataset.curentPathFiles]
        : null;

    const curentImageContactBackgroundUrl =
        !!imputDocumentFile.dataset.curentShowingImages && imputDocumentFile.dataset.curentShowingImages !== ""
            ? [imputDocumentFile.dataset.curentShowingImages]
            : null;

    //
    const dataMaxFile = !!imputDocumentFile.dataset.maxFile && imputDocumentFile.dataset.maxFile !== ""
        ? +imputDocumentFile.dataset.maxFile
        : 3;
    const dataMaxSize = !!imputDocumentFile.dataset.maxFile && imputDocumentFile.dataset.maxSize !== ""
        ? +imputDocumentFile.dataset.maxSize
        : 5;
    //

    fileUploadNewReview = new FileUpload();
    fileUploadNewReview.Init(null,
        curentImageContactFilePath,
        curentImageContactBackgroundUrl,
        "#inputDetailFromFile",//file
        "#newReviewContainer",//review showing
        "#newReviewContainer",//new showing
        "#frmContact",
        dataMaxFile,
        console.log("change"),
        true,
        "DetailFormFile", dataMaxSize);//unique name
}

//contact
function clearform() {
    $('#frmContact')[0].reset();
    var imageReverContainer = document.getElementById("newReviewContainer");

    if (!!imageReverContainer) {
        imageReverContainer.innerHTML = "";
    }


}

function reloadImage() {
    var d = new Date();
    $("#img-captcha").attr("src", "/get-captcha-image?" + d.getTime());
}


function initMap() {
    var mapContainer = document.getElementById('mapContainer');

    if (!!mapContainer) {
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
}