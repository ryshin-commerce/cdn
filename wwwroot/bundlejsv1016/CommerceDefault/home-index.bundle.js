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
"use strict";

function loadSuggestProducts() {
    var productClassObjs = LocalStorageHelper.Get(LocalStorageNamesEnum.UserCategoryList).sort(
        (a, b) => (a.InOrderCount * 5 + a.CompleteCount * 3 + a.AddToCartCount * 2 + a.ViewCount >
            b.InOrderCount * 5 + b.CompleteCount * 3 + b.AddToCartCount * 2 + b.ViewCount)
        ? 1
            : -1);
    productClassObjs.length = Math.min(3, productClassObjs.length) ;

    var inputContainer = document.querySelector("#formLazySuggestProduct #inputContainer");
    var html = "";

    for (var i = 0; i < productClassObjs.length; i++) {
        var inputCategoryId = '<input class="hide" type="text" name="CategoryLogModels[' + i + '].CategoryId" value="' + productClassObjs[i].CategoryId + '">';
        var inputViewCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].ViewCount" value="' + productClassObjs[i].ViewCount + '">';
        var inputAddToCartCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].AddToCartCount" value="' + productClassObjs[i].AddToCartCount + '">';
        var inputInOrderCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].InOrderCount" value="' + productClassObjs[i].InOrderCount + '">';
        var inputCompleteCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].CompleteCount" value="' + productClassObjs[i].CompleteCount + '">';
        html += (inputCategoryId + inputViewCount + inputAddToCartCount + inputInOrderCount + inputCompleteCount);
    }

    inputContainer.innerHTML = html;
    document.getElementById("btnReloadSuggestProduct").click();
}

"use strict";

document.addEventListener("DOMContentLoaded",
    function() {
        loadUserViewedProduct();
    });

function loadUserViewedProduct() {
    var productClassObjs = LocalStorageHelper.Get(LocalStorageNamesEnum.ViewProductClassificationIds);

    if (!productClassObjs || !productClassObjs.length) {
        return;
    }

    
    var productViewedContainer = document.querySelector("#productViewedContainer");

    for (var i = 0; i < productClassObjs.length; i++) {
        var productItem = productClassObjs[i];       
        var strElement = '<a href="[ProductUrl]" title="[ProductName]" class="_image-wrap tablet-margin -tablet-margin-bottom rounded-4 border-1 solid border-silver padding-5"> <img alt="[ProductName]" class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="[ProductThumnailUrl]"></a>';
        strElement = strElement.replace(/\[ProductUrl\]/g, productItem.ProductUrl);
        strElement = strElement.replace(/\[ProductName\]/g, productItem.ProductName);
        strElement = strElement.replace(/\[ProductThumnailUrl\]/g, productItem.ProductThumnailUrl);
        productItem = Site.HtmlToElement(strElement);
        productViewedContainer.appendChild(productItem[0]);
    }

    Site.BeLazyRevalidate();
}
"use strict";
var btnLazyLoadProducts;
var imageCaptcha;
document.addEventListener("DOMContentLoaded",
    function() {
        init();
        loadSwipperHome("[data-container-slider] .swiper-container");
        loadSwipper("[data-review] .swiper-container");
        loadBrandSwipper("[data-brand-name]");
        lazyloadCategoriesProduct();
        PushNotifications.bindingUi('[data-contact]');
        loadSuggestProducts();
    });

window.onload = function () {
    submitProductWidgetAction("[data-bestseller]");
    submitProductWidgetAction("[data-new-products]");
};


function init() {
    btnLazyLoadProducts = document.querySelectorAll("form[data-selector-lazyload-products] [type='submit']");
};

function lazyloadCategoriesProduct() {
    for (var i = 0; i < btnLazyLoadProducts.length; i++) {
        btnLazyLoadProducts[i].click();
    }

}

function loadFlashSaleSwiper() {

    Site.bLazy.load(document.querySelectorAll(".swiper-flashsale-container img", true), false);

    var isMobile = document.querySelector("[data-device=Mobile]");
    var isDesktop = document.querySelector("[data-device=Desktop]");
    var slidesPerView = 5;

    if (isMobile) {
        slidesPerView = 2;
    }
    else if (!isDesktop) {
        slidesPerView = 4;
    }


    var flashSales = new Swiper('.swiper-flashsale-container',
        {
            slidesPerView: slidesPerView,
            spaceBetween: -1,
            slidesPerGroup: slidesPerView,
            loop: false,
            loopFillGroupWithBlank: true,
            //pagination: {
            //    el: '.swiper-pagination',
            //    clickable: true,
            //},
            lazy: {
                loadPrevNext: true
            },
            preloadImages: false,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
}

function loadSwipper(selector) {
    selector = !!selector ? selector : '.swiper-container';
    selector = selector + " ";
    console.log(selector);
    var swiper = new Swiper(selector, {
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: selector + '.swiper-button-next',
            prevEl: selector + '.swiper-button-prev'
        }
    });
};

function loadSwipperHome(selector) {
    var swiper = new Swiper(selector, {
        pagination: {
            el: selector + ' [data-pagination-1]',
            dynamicBullets: true
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: selector + '.swiper-button-next',
            prevEl: selector + '.swiper-button-prev'
        }
    });
};

function loadBrandSwipper(selector) {
    Site.bLazy.load(document.querySelectorAll("[data-brand-name-container] img", true), false);
    var isMobile = document.querySelector("[data-device=Mobile]");
    var isDesktop = document.querySelector("[data-device=Desktop]");
    var slidesPerView = 8;

    if (isMobile) {
        slidesPerView = 3;
    }
    else if (!isDesktop) {
        slidesPerView = 5;
    }

    var brandSwiper = new Swiper(selector + " .swiper-container", {
        slidesPerView: slidesPerView,
        slidesPerGroup: slidesPerView,
        loop: true,
        loopFillGroupWithBlank: true,
        spaceBetween: 10,
        //autoplay: {
        //    delay: 4000,
        //    disableOnInteraction: false
        //},
        navigation: {
            nextEl: selector + ' .swiper-button-next-brand',
            prevEl: selector + ' .swiper-button-prev-brand'
        }
    });
};
//# sourceMappingURL=home-index.bundle.js.map
