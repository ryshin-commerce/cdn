
"use strict";

var listQuantities, chkOutOfStock, txtQuantity, attribute1Items, attribute2Items, productClassificationId, dataPrice, newestPostsContainer;
var activeProductClass;
var subscribeButton, discountPercentEle;
var flashSaleContainer, dataCountEle, dataProcessBarEle, dataDelPrice;
var isFistLoad = true;
var didScroll = false, listSections, dataHead, isClick = false;

document.addEventListener("DOMContentLoaded",
    function () {
        innitFileUpload();
    });



function innitFileUpload() {
    //----------------
    //----------------
    var imputDocumentFile = document.getElementById("inputRatingFormFile");

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

    var fileUploadNewReview = new FileUpload();
    fileUploadNewReview.Init(null,
        curentImageContactFilePath,
        curentImageContactBackgroundUrl,
        "#inputRatingFormFile",//file
        "#newReviewContainer",//review showing
        "#newReviewContainer",//new showing
        "#frmProductRating",
        dataMaxFile,
        console.log("change"),
        true,
        "RatingFormFile", dataMaxSize);//unique name
}

//contact
function clearform() {
    $('#frmProductRating')[0].reset();
    var imageReverContainer = document.getElementById("newReviewContainer");

    if (!!imageReverContainer) {
        imageReverContainer.innerHTML = "";
    }
}

function ratingCompleteCallBack() {
    location.reload();
}