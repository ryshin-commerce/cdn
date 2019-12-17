"use strict";
var btnLazyLoadProducts;

document.addEventListener("DOMContentLoaded",
    function () {
        init();
        loadSwipper();
        registerPushServiceWorker();
        checkPushNotification();
        lazyloadCategoriesProduct();
    });

function init() {
    btnLazyLoadProducts = document.querySelectorAll("form[data-selector-lazyload-products] [type='submit']");
};

function lazyloadCategoriesProduct() {
    for (var i = 0; i < btnLazyLoadProducts.length; i++) {
        btnLazyLoadProducts[i].click();
    } 
   
}

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
        }
    });
};

function checkPushNotification() {
    fetch('/checkpushnotifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(function (response) {
            if (response.ok) {
                console.log('Successfully subscribed for Push Notifications');
            } else {
                console.log('Failed to store the Push Notifications subscrition on server');
            }
        }).catch(function (error) {
            console.log('Failed to store the Push Notifications subscrition on server: ' + error);
        });
}
