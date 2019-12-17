"use strict";

var listQuantities, chkOutOfStock, txtQuantity, attribute1Items, attribute2Items, productClassificationId, dataPrice, newestPostsContainer;
var activeProductClass;
document.addEventListener("DOMContentLoaded",
    function () {
        init();

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
        JsBarcode("._barcode").init();
        load360Spin();
    });

function init() {
    activeProductClass = document.querySelector("[data-active-product-classification]");
    listQuantities = document.querySelectorAll("._quantity");
    chkOutOfStock = document.querySelector("[data-out-of-stock]");
    txtQuantity = document.querySelector("[data-quantity]");
    attribute1Items = document.querySelectorAll('input[name="Attribute1Value"]');
    attribute2Items = document.querySelectorAll('input[name="Attribute2Value"]');
    productClassificationId = document.querySelector("[name=ProductClassificationId]");
    dataPrice = document.querySelector("[data-price]");
    newestPostsContainer = document.querySelector("[data-selector-newest-post]");
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
    SlideToProductClass(selectedQuantityInfo[0].productClassificationId);
    //TODO reload slider by productClass
    if (selectedQuantityInfo.length === 0) {
       chkOutOfStock.checked = true;
        return;
    };
    
    history.pushState(null, null, selectedQuantityInfo[0].url);
    //location.replace(selectedQuantityInfo[0].url);

    var quantity = selectedQuantityInfo[0].quantity;
 
    productClassificationId.value = selectedQuantityInfo[0].productClassificationId;
    chkOutOfStock.checked = quantity <= 0;
    txtQuantity.max = quantity;

    if (+txtQuantity.value > +txtQuantity.max) {
        txtQuantity.value = +txtQuantity.max;
    }
    //

    var quantitiesPrices = listPriceInfo.filter(function (item) {
        return item.attribute1Value === attributeValue1 && item.attribute2Value === attributeValue2;
    })[0].quantitiesPrice;

    var priceUnit = quantitiesPrices[quantitiesPrices.length - 1].money;
    for (let i = quantitiesPrices.length - 1; i >= 0; i--) {

        if (quantitiesPrices[i].range !== 0 && +txtQuantity.value >= quantitiesPrices[i].range) {
            break;
        }

        priceUnit = quantitiesPrices[i].money;
    }

    dataPrice.innerHTML = WNumbHelper.GetFrNumber(priceUnit);
    console.log(quantity);
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
                width: 480,
                height: 480,
                // reverse interaction direction
                sense: -1,
                frameTime: 100,
                responsive: false
            });
        } else {
            $('.spritespin').spritespin({
                source: image360Sources,
                width: 480,
                height: 480,
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
