"use strict";
var listQuantities, summaryElement, btnReloadShopingCartTable, btnRemoveRows, btnUpdateQuantity;
document.addEventListener("DOMContentLoaded",
    function () {
        init();
        btnReloadShopingCartTable.click();
        //for (var j = 0; j < btnRemoveRows.length; j++) {
        //    btnRemoveRows[j].addEventListener("click", function(eve) {
           
        //    });
        //}
        

    });

function processListItemShopingCartTable() {
    listQuantities = document.querySelectorAll("._quantity");

    for (var i = 0; i < listQuantities.length; i++) {
        var quantity = new Quantity();
        quantity.Init(listQuantities[i], reloadCartMoney);
    }

}

function init() {
    summaryElement = document.querySelector("[data-summary]");  
    btnReloadShopingCartTable = document.querySelector("#frmLazyLoadShopingCartTable #btnReloadShopingCartTable");
    btnUpdateQuantity = document.getElementById("btnUpdateQuantity");
}

function removeCartItemComplete() {
    btnReloadShopingCartTable.click();
}


function reloadCartMoney() {
    const rowItems = document.querySelectorAll("[data-class-id]");
    var summaryMoney = 0;

    for (let i = 0; i < rowItems.length; i++) {

        var quantytyElement = rowItems[i].querySelector("._quantity");
        const quantity = +rowItems[i].querySelector("[data-quantity]").value;
        var priceUnit = getUnitPrice(JSON.parse(quantytyElement.dataset.price), quantity);

        const unitPriceElement = rowItems[i].querySelector("[data-unit-price]");
        unitPriceElement.innerHTML = WNumbHelper.GetFrNumber(priceUnit);

        const itemPrice = rowItems[i].querySelector("[data-item-price]");
        const itemMoney = priceUnit * quantity;
        summaryMoney += itemMoney;
        itemPrice.innerHTML = WNumbHelper.GetFrNumber(itemMoney);
    }

    const summaryItem = document.querySelector("[data-summary]");
    summaryItem.innerHTML = WNumbHelper.GetFrNumber(summaryMoney);
    btnUpdateQuantity.click();
}

function getUnitPrice(lsitPrices, quantity) {
   
    var priceUnit = lsitPrices[lsitPrices.length-1].money;

    for (let j = lsitPrices.length - 1; j >= 0; j--) {

        if (lsitPrices[j].quantity !== 0 && quantity >= lsitPrices[j].quantity) {
            break;
        }

        priceUnit = lsitPrices[j].money;
    }

    return priceUnit;
}
