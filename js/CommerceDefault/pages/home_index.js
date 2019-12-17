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