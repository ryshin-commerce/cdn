"use strict";
var btnLazyLoadProducts, tabs;
var imageCaptcha;

document.addEventListener("DOMContentLoaded",
    function () {
        init();
        loadSwipper();
        loadProductSlider("[data-sec-product-1] [data-col-1] ._id-listProduct", "[data-sec-product-1] [data-col-1] ._swiper-button-prev", "[data-sec-product-1] [data-col-1] ._swiper-button-next", Site.IsMobileBackend() ? 2 : 1, 3); 
        loadProductSlider("[data-sec-product-1] [data-col-2] ._id-listProduct", "[data-sec-product-1] [data-col-2] ._swiper-button-prev", "[data-sec-product-1] [data-col-2] ._swiper-button-next", Site.IsMobileBackend() ? 2 : 1, 3); 
        lazyLoadFlashsale();
        lazyLoadProductCategory();
        loadSuggestProducts();
    });

function init() {
};

function lazyLoadFlashsale() {
    document.getElementById("btnLazyLoadFlashSale").click();
}

function loadFlashSaleSwiper() {
    var swiperProductCol3 = new Swiper('[data-sec-product-1] [data-col-3] ._id-listProduct', {
        spaceBetween: 0,
        slidesPerView: Site.IsMobileBackend() ? 2 : 1,
        slidesPerColumn: 3,
        navigation: {
            nextEl: '[data-col-3] ._swiper-button-next',
            prevEl: '[data-col-3] ._swiper-button-prev'
        }
    });

}

function loadSwipper() {
    var numberSliders = Site.IsMobileBackend() ? 2 :5;

    var swiperBrandName = new Swiper('.swiper-container-partner-name', {
        spaceBetween: 0,
        slidesPerView: numberSliders,
        centeredSlides: false,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: '.swiper-button-next-brand',
            prevEl: '.swiper-button-prev-brand'
        }
    });

    numberSliders = Site.IsMobileBackend() ? 1 : 2;


    var swiperReview = new Swiper('.swiper-container-review', {
        spaceBetween: 0,
        slidesPerView: numberSliders,
        centeredSlides: false,
        loop: false,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: '._swiper-button-prev',
            prevEl: '._swiper-button-next'
        }
    });
};

function lazyLoadProductCategory() {
    var categoryLazyBtns = document.querySelectorAll("[data-selector-lazyload-products] button");

    for (var i = 0; i < categoryLazyBtns.length; i++) {
        categoryLazyBtns[i].click();
    }
}
