"use strict";

document.addEventListener("DOMContentLoaded",
    function () {
        init();
    });

function init() {

};

function reloadShopingCart() {
    var btnReloadShopingCart1 = document.querySelector("#frmLazyLoadShopingCartmodel #btnReloadShopingCartmodel");
    btnReloadShopingCart1.click();
}

function addProductToCartSuccessful() {
    AjaxRequest.SendRequestGetJson("GET",
        "/shopingcart/getitemsincart",
        {},
        function (e, v) {
            var cartItemEle = document.querySelector("[data-cart-item]");
            cartItemEle.innerText = JSON.parse(e).count;
            cartItemEle.classList.add("bounce");
            cartItemEle.classList.add("animated");
            setTimeout(function () {
                cartItemEle.classList.remove("animated");
                cartItemEle.classList.remove("bounce");
            }, 2000);
        });
}

function flyImageToCartWidget(categoryId,element, apendToParentElementClassName) {

    //var cartIcon = document.querySelector("[data-cart-item]");
    //var ele = Site.FindParent(element, "_p-product-widget").querySelector("img");
    //var offset = ele.getBoundingClientRect();
    //var cloneElement = ele.cloneNode();
    //lockOnsCroll = true;
    if (!categoryId) {
        LocalStorageHelper.LogCategory(categoryId, false, true, false, false);
    }

    var dataHead = document.querySelector("[data-head]");
    dataHead.classList.remove("hide");
    Site.SetLockOnScroll();
}

function flyImageToCart(categoryId) {
    if (!categoryId) {
        LocalStorageHelper.LogCategory(categoryId, false, true, false, false);
    }
    //var cartIcon = document.querySelector("[data-cart-item]");

    //var ele = document.querySelector(targetElementSelector);
    //var offset = ele.getBoundingClientRect();
    //var cloneElement = ele.cloneNode();

    var dataHead = document.querySelector("[data-head]");
    dataHead.classList.remove("hide");
    Site.SetLockOnScroll();
    //if (Site.IsMobile() && dataHead.classList.contains("_zDocActive")) {
       
    //    cloneElement.width = 50;
    //    cloneElement.height = 50;
    //    cloneElement.style.top = "calc(100vh - 50px)";
    //    cloneElement.style.left = "50%";
    //    cloneElement.classList = "_zflyImage";
    //    Site.FindParent(ele, apendToParentElementClassName).appendChild(cloneElement);

    //    setTimeout(function () {
    //        cloneElement.style.top = cartIcon.getBoundingClientRect().top + "px";
    //        cloneElement.style.left = cartIcon.getBoundingClientRect().left + "px";
    //        cloneElement.classList.add("_zfly");
    //    }, 400);

    //    setTimeout(function () {
    //        cloneElement.remove();
    //    }, 2000);
    //} else {
    //    cloneElement.width = ele.width;
    //    cloneElement.height = ele.height;
    //    cloneElement.style.top = offset.y + "px";
    //    cloneElement.style.left = offset.x + "px";
    //    cloneElement.classList = "_zflyImage";
    //    Site.FindParent(ele, apendToParentElementClassName).appendChild(cloneElement);

    //    setTimeout(function () {
    //        cloneElement.style.top = cartIcon.getBoundingClientRect().top + "px";
    //        cloneElement.style.left = cartIcon.getBoundingClientRect().left + "px";
    //        cloneElement.classList.add("_zfly");
    //    }, 400);

    //    setTimeout(function () {
    //        cloneElement.remove();
    //    }, 2000);
    //}

}

//function flyImageToCartBk(targetElementSelector, apendToParentElementClassName) {
//    var cartIcon = document.querySelector("[data-cart-item]");

//    var ele = document.querySelector(targetElementSelector);
//    var offset = ele.getBoundingClientRect();
//    var cloneElement = ele.cloneNode();

//    var dataHead = document.querySelector("[data-head]");
//    if (Site.IsMobile() && dataHead.classList.contains("_zDocActive")) {
//        dataHead.classList.remove("hide");
//        cloneElement.width = 50;
//        cloneElement.height = 50;
//        cloneElement.style.top = "calc(100vh - 50px)";
//        cloneElement.style.left = "50%";
//        cloneElement.classList = "_zflyImage";
//        Site.FindParent(ele, apendToParentElementClassName).appendChild(cloneElement);

//        setTimeout(function () {
//            cloneElement.style.top = cartIcon.getBoundingClientRect().top + "px";
//            cloneElement.style.left = cartIcon.getBoundingClientRect().left + "px";
//            cloneElement.classList.add("_zfly");
//        }, 400);

//        setTimeout(function () {
//            cloneElement.remove();
//        }, 2000);
//    } else {
//        cloneElement.width = ele.width;
//        cloneElement.height = ele.height;
//        cloneElement.style.top = offset.y + "px";
//        cloneElement.style.left = offset.x + "px";
//        cloneElement.classList = "_zflyImage";
//        Site.FindParent(ele, apendToParentElementClassName).appendChild(cloneElement);

//        setTimeout(function () {
//            cloneElement.style.top = cartIcon.getBoundingClientRect().top + "px";
//            cloneElement.style.left = cartIcon.getBoundingClientRect().left + "px";
//            cloneElement.classList.add("_zfly");
//        }, 400);

//        setTimeout(function () {
//            cloneElement.remove();
//        }, 2000);
//    }

//}



function processListItemShopingCartmodel() {

}