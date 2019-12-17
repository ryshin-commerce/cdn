"use strict";
var listQuantities, chkOutOfStock, txtQuantity, attribute1Items, attribute2Items, productClassificationId, dataPrice, newestPostsContainer;
var activeProductClass;
var subscribeButton, discountPercentEle;
var flashSaleContainer, dataCountEle, dataProcessBarEle, dataDelPrice;
var isFistLoad = true;
var didScroll = false, listSections, dataHead, isClick = false;

document.addEventListener("DOMContentLoaded",
    function () {
        init();
        Site.LockOnsCroll = false;
        var i;

        for (i = 0; i < listQuantities.length; i++) {
            const quantity = new Quantity();
            quantity.Init(listQuantities[i], reloadMoneyAndQuantity);
        }
        for (i = 0; i < attribute1Items.length; i++) {
            attribute1Items[i].addEventListener("change", reloadMoneyAndQuantity);
        }
        for (i = 0; i < attribute2Items.length; i++) {
            attribute2Items[i].addEventListener("change", reloadMoneyAndQuantity);
        }

        reloadMoneyAndQuantity();
        loadJqueryZoom();
        try {
            JsBarcode("._barcode").init();
        } catch (e) {
            console.log(e);
        }

        load360Spin();
        atiCopyRight();
        //subscribeButton = document.getElementById('btnSubscribe');

        //if (!!subscribeButton) {
        //    subscribeButton.addEventListener('click',
        //        function () {
        //            PushNotifications.subscribeForPushNotifications(subscribeCallBack);
        //        });
        //}
        PushNotifications.initialize();        
        loadScrollNav();
        LocalStorageHelper.LogCategory(productCategoryId, true, false, false, false);
        const thumnailSrc = document.querySelector("[data-first-thumnail]").dataset.firstThumnail;   
        LocalStorageHelper.LogProductClassIdView(activeProductClass.dataset.activeProductId, document.querySelector('[name=ProductName]').value, thumnailSrc, document.querySelector("link[rel='canonical']").href);
        processAnonymousUser();
        innitFileUpload();
        document.getElementById("btnReloadRatings").click();
    });


function submitProductWidgetAction() {
}

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

function loadScrollNav() {
    var btnNavs = document.querySelectorAll("[data-nav-product-detail] button");
    for (var i = 0; i < btnNavs.length; i++) {
        btnNavs[i].addEventListener("click",
            function (eve) {
                //Site.LockOnsCroll = true;
                Site.ScrollToElement("[data-section='" + eve.currentTarget.dataset.target + "']");
                //setTimeout(function () {
                //    //Site.LockOnsCroll = false;
                //    document.querySelector("[data-head]").classList.remove("_zDocActive");
                //}, 3000);
            });
    }

    //window.onscroll = function () {
    //    if (!Site.LockOnsCroll) {
    //        updateZDocActive();
    //    }
    //};
}

function processFancybox() {
    //$("a._z-fancyBox").fancybox();
}

function processAnonymousUser() {
    var canvases = document.querySelectorAll("._id-listRatings canvas");

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
            canvas.style.width= canvasCssWidth+"px";
            canvas.style.height = canvasCssHeight + "px";
            context.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        context.fillStyle = stringToHslColor(initials,30,80);
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = (canvasCssHeight/2)+ "px Arial";
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

var zDockInterval = setInterval(function () {

    var sectionActive = 1;
    for (var i = 0; i < listSections.length; i++) {
        if (!listSections[i]) {
            continue;
        }

        if (listSections[i].getBoundingClientRect().y < 5) {
            sectionActive = listSections[i].dataset.section;
        }
    }
    dataHead.dataset.sessionActive = sectionActive;

}, 100);



//
function loadFlashSaleSwiper() {    
    Site.bLazy.load(document.querySelectorAll(".swiper-flashsale-container img", true), false);

    var isMobile = document.querySelector("[data-device=Mobile]");
    var isDesktop = document.querySelector("[data-device=Desktop]");
    var slidesPerView = 3;

    if (isMobile) {
        slidesPerView = 1;
    }
    else if (!isDesktop) {
        slidesPerView = 2;
    }


    var flashSales = new Swiper('.swiper-flashsale-container',
        {
            slidesPerView: slidesPerView,
            spaceBetween: 10,
            loop: false,                      
            lazy: {
                loadPrevNext: true
            },
            preloadImages: false,
            //autoplay: {
            //    delay: 4000,
            //    disableOnInteraction: false
            //},
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
}

function atiCopyRight() {
    var itemListElement = document.querySelector("[itemprop='itemListElement']:last-child");
    var text = itemListElement.innerText;
    var url = itemListElement.querySelector("[content]").attributes["content"].value;

    var fakaH3Tag = document.createElement("h3");
    fakaH3Tag.classList = "d-none";

    var atag = document.createElement("a");
    atag.innerText = text + " tại " + window.location.hostname + "";
    atag.href = url;
    atag.alt = "Chi tiết sản phẩm " + text + " tại " + window.location.hostname + ". ";
    atag.classList = "_atyc";

    fakaH3Tag.appendChild(atag);
    fakaH3Tag.setAttribute("style", "display:block !important;font-size:0 !important;height:0; color:transparent !important;  ");

    var container = document.querySelector("[data-html-content]");
    container.insertBefore(fakaH3Tag, container.querySelector("h3 ~ p"));
}


function init() {
    activeProductClass = document.querySelector("[data-active-product-classification]");
    listQuantities = document.querySelectorAll("._quantity");
    chkOutOfStock = document.querySelector("[data-out-of-stock]");
    txtQuantity = document.querySelector("[data-quantity]");
    attribute1Items = document.querySelectorAll('input[name="Attribute1Value"]');
    attribute2Items = document.querySelectorAll('input[name="Attribute2Value"]');
    productClassificationId = document.querySelector("[name=ProductClassificationId]");
    dataPrice = document.querySelector("[data-price]");
    dataDelPrice = document.querySelector("[data-del-price]");

    discountPercentEle = document.querySelector("[data-css-discount]");
    newestPostsContainer = document.querySelector("[data-selector-newest-post]");
    flashSaleContainer = document.querySelector("[data-flash-sale-detail]");
    dataCountEle = flashSaleContainer.querySelector("[data-count]");
    dataProcessBarEle = flashSaleContainer.querySelector("progress");

    listSections = [
        document.querySelector("[data-section='1']"),
        document.querySelector("[data-section='2']"),
        document.querySelector("[data-section='3']"),
        document.querySelector("[data-section='4']"),
        document.querySelector("[data-section='5']"),
        document.querySelector("[data-section='6']"),
        document.querySelector("[data-section='7']")
    ];
    dataHead = document.querySelector("main");
};


function reloadMoneyAndQuantity() {
    var attributeValue1 = !!document.querySelector('input[name="Attribute1Value"]:checked') ? document.querySelector('input[name="Attribute1Value"]:checked').value : "";
    var attributeValue2 = !!document.querySelector('input[name="Attribute2Value"]:checked') ? document.querySelector('input[name="Attribute2Value"]:checked').value : "";

    var selectedQuantityInfo = listPriceInfo.filter(function (item) {
        return item.attribute1Value === attributeValue1 && item.attribute2Value === attributeValue2;
    });
    //TODO reload slider by productClass
    activeProductClass.dataset.activeProductClassification = selectedQuantityInfo[0].productClassificationId;



    //LoadSwiperDefault();
    if (isFistLoad) {
        isFistLoad = false;
    } else {
        SlideToProductClass(selectedQuantityInfo[0].productClassificationId);
    }

    //TODO reload slider by productClass
    if (selectedQuantityInfo.length === 0) {
        chkOutOfStock.checked = true;
        return;
    };

    history.replaceState(null, null, selectedQuantityInfo[0].url);
    //location.replace(selectedQuantityInfo[0].url);

    var quantity = selectedQuantityInfo[0].quantity;

    productClassificationId.value = selectedQuantityInfo[0].productClassificationId;
    chkOutOfStock.checked = quantity <= 0;
    txtQuantity.max = quantity;

    if (+txtQuantity.value > +txtQuantity.max) {
        txtQuantity.value = +txtQuantity.max;
    }
    //
    var selectedClassItem = listPriceInfo.filter(function (item) {
        return item.attribute1Value === attributeValue1 && item.attribute2Value === attributeValue2;
    })[0];

    var quantitiesPrices = selectedClassItem.quantitiesPrice;

    var priceUnit = quantitiesPrices[quantitiesPrices.length - 1].money;
    for (let i = quantitiesPrices.length - 1; i >= 0; i--) {

        if (quantitiesPrices[i].range !== 0 && +txtQuantity.value >= quantitiesPrices[i].range) {
            break;
        }

        priceUnit = quantitiesPrices[i].money;
    }

    dataPrice.innerHTML = WNumbHelper.GetFrNumber(priceUnit) + "<sup>đ</sup>";
    dataPrice.dataset.price = priceUnit;
    dataPrice.style.visibility = "visible";

    dataDelPrice.classList.add("hide");
    if (priceUnit < (+dataDelPrice.dataset.delPrice)) {
        dataDelPrice.classList.remove("hide");
    }

    discountPercentEle.classList.add("hide");
    var discountPercent = 100 - priceUnit * 100 / selectedClassItem.price;

    if (discountPercent > 0) {
        discountPercentEle.classList.remove("hide");
        discountPercentEle.innerText = (selectedClassItem.isFlashSale ? "Flash Sale -" : "Giảm ") + Number(discountPercent).toFixed(2) + "%";
    }

    dataCountEle.removeAttribute("data-flash-deal-count-down");
    dataProcessBarEle.removeAttribute("data-is-host");
    flashSaleContainer.classList.add("hide");

    if (selectedClassItem.isFlashSale) {
        flashSaleContainer.classList.remove("hide");

        if (selectedClassItem.valueQuantity <= 0) {
            dataCountEle.dataset.flashDealCountDown = selectedClassItem.countDownTime;
            checkTimeCountDown("[data-css-simple-detail]");
        }
        else {
            dataCountEle.innerText = "còn " + selectedClassItem.countDownQuantity + " sản phẩm";
        }

        if (selectedClassItem.valueQuantity * selectedClassItem.maxHours > selectedClassItem.hours * selectedClassItem.maxValueQuantity)//valueQuantity  / maxValueQuantity > hours / maxHours
        {
            debugger;
            dataProcessBarEle.setAttribute("data-is-hot", "true");
            dataProcessBarEle.max = selectedClassItem.maxValueQuantity;
            dataProcessBarEle.value = selectedClassItem.valueQuantity;
        }
        else {
            dataProcessBarEle.removeAttribute("data-is-hot");
            dataProcessBarEle.max = selectedClassItem.maxHours;
            dataProcessBarEle.value = selectedClassItem.hours;
        }

    }
    //const rowItems = document.querySelectorAll("[data-class-id]");
    //var summaryMoney = 0;
    //for (let i = 0; i < rowItems.length;i++) {
    //    const unitPrice = +rowItems[i].querySelector("[data-unit-price]").dataset.unitPrice;
    //    const quantity = +rowItems[i].querySelector("[data-quantity]").value;
    //    const itemPrice = rowItems[i].querySelector("[data-item-price]");
    //    const itemMoney = unitPrice * quantity;
    //    summaryMoney += itemMoney;
    //    itemPrice.innerHTML = WNumbHelper.GetFrNumber(itemMoney);
    //}
    //const summaryItem = document.querySelector("[data-summary]");
    //summaryItem.innerHTML = WNumbHelper.GetFrNumber(summaryMoney);

    var frmAddToCart = document.querySelector("#frmAddToCart");

    if (!!frmAddToCart) {
        var productId = frmAddToCart.querySelectorAll('[name=ProductClassificationId]')[1].value ||
            frmAddToCart.querySelectorAll('[name=ProductClassificationId]')[0].value;
        var productClassSelected = document.querySelector('[data-css-simple-detail] [type=radio]:checked');
        var productClassName = productClassSelected != null ? productClassSelected.value : "";
        var productName = document.querySelector('[name=ProductName]').value;
        EnhancedEcommerce.AddImpression(productId, productName, productClassName);
    }

}
function updateAnalytic() {
    var frmAddToCart = document.querySelector("#frmAddToCart");

    if (!!frmAddToCart) {
        var productId = frmAddToCart.querySelectorAll('[name=ProductClassificationId]')[1].value ||
            frmAddToCart.querySelectorAll('[name=ProductClassificationId]')[0].value;
        var productClassSelected = document.querySelector('[data-css-simple-detail] [type=radio]:checked');
        var productClassName = productClassSelected != null ? productClassSelected.value : "";
        var productName = document.querySelector('[name=ProductName]').value;
        var price = document.querySelector('[data-css-simple-detail] [data-price]').dataset.price;
        EnhancedEcommerce.AddProduct(productId, productName, productClassName, '', '', price);
    }

}

function btnByNowClick(eve) {
    window.location = eve.target.dataset.href;
}

function load360Spin() {
    var spritespin = document.querySelector('.spritespin');
    if (spritespin) {
        if (!!spritespin.dataset.width) {
            $('.spritespin').spritespin({
                source: image360Sources,
                width: Math.min(document.querySelector('#spin360').getBoundingClientRect().width, 500),
                height: Math.min(document.querySelector('#spin360').getBoundingClientRect().width, 500),               
                // reverse interaction direction
                sense: -1,
                frameTime: 100,
                responsive: false
            });
        } else {
            $('.spritespin').spritespin({
                source: image360Sources,
                width: 500,
                height: 500,
                // reverse interaction direction
                sense: -1,
                frameTime: 100,
                responsive: true
            });
        }

    }
}

function ratingCompleteCallBack() {
    console.log("Reload ratings");

    document.querySelector("#ratingSection details").removeAttribute("open");
}

function loadJqueryZoom() {
    var isDesktop = document.querySelector("[data-device=Desktop]");
    if (!!isDesktop) {
        var imageThumnails = document.querySelectorAll('[data-zoom]');

        for (var i = 0; i < imageThumnails.length; i++) {
            new Drift(imageThumnails[i], {
                paneContainer: document.querySelector("[data-css-simple-detail]")
            });
        }
    }
}


