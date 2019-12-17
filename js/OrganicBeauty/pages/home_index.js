"use strict";
var btnLazyLoadProducts, tabs;
var imageCaptcha;

document.addEventListener("DOMContentLoaded",
    function () {
        init();
        loadSwipper();
        //contact
        imageCaptcha = document.querySelector("[data-captcha-container] ._image-wrap");

        if (!!imageCaptcha) {
            imageCaptcha.addEventListener("click", function (e) {
                reloadImage();
            });
        }
    });

function init() {
    btnLazyLoadProducts = document.querySelectorAll("form[data-selector-lazyload-products] [type='submit']");
    tabs = new TabPages();
    tabs.Init("[data-active-tab-number]");
    //tabs.Tabs[0].click();
    tabs.Tabs[tabs.SelectedTabNumber - 1].click();
};

function lazyloadCategoriesProduct(containerElement, tabNumber) {
    var submitFormButton = containerElement.querySelector("form button");
    submitFormButton.click();

    submitFormButton.onclick = function () {
        //do what you want;
        return false;
    };
};


function loadSwipper() {
    var swiper = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        on: {
            slideChange: function (x, y) {
                var h2s = document.querySelectorAll('.swiper-slide h2');
                var h3s = document.querySelectorAll('.swiper-slide h3');

                for (var i = 0; i < h2s.length; i++) {
                    h2s[i].classList.remove('lightSpeedIn', 'animated');
                }
                for (var j = 0; j < h3s.length; j++) {
                    h3s[j].classList.remove('flipInX', 'animated');
                }

                var h2 = document.querySelector('.swiper-slide-active h2');
                var h3 = document.querySelector('.swiper-slide-active h3');
                h2.classList.add('lightSpeedIn', 'animated');
                h3.classList.add('flipInX', 'animated');
                /* do something */
            }
        }
    });

    var numberSliders = Site.IsMobileBackend() ? 2 : 5;
    var swiperBrandName = new Swiper('.swiper-container-brand-name', {
        spaceBetween: 30,
        slidesPerView: numberSliders,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });

    numberSliders = Site.IsMobileBackend() ? 1 : 3;
    var swiperposts = new Swiper('.swiper-container-posts', {
        slidesPerView: numberSliders,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });
};

//contact
function clearform() {
    $('#frmContact')[0].reset();
}

function reloadImage() {
    var d = new Date();
    $("#img-captcha").attr("src", "/get-captcha-image?" + d.getTime());
}