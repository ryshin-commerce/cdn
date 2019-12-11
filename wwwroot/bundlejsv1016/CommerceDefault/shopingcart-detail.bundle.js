/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

function Quantity() {
    // converting initialize data
    this.Extend = function (downElement, upElement, targetElement, valueChangeCallBack) {
        this.DownElement = downElement;
        this.UpElement = upElement;
        this.TargetElement = targetElement;
        this.ValueChangeCallBack = valueChangeCallBack || function() {console.log("ValueChange don't have callback")};
        this.Process();
    };

    this.Process = function () {
        var self = this;
        this.UpElement.addEventListener("click", function(eve) {
            if (+self.TargetElement.value < +self.TargetElement.max) {
                self.TargetElement.value = ++self.TargetElement.value;

                if (!!self.ValueChangeCallBack) {
                    self.ValueChangeCallBack();
                }
            }
        });
        this.DownElement.addEventListener("click", function (eve) {
            if (+self.TargetElement.value > +self.TargetElement.min) {
                self.TargetElement.value = --self.TargetElement.value;

                if (!!self.ValueChangeCallBack) {
                    self.ValueChangeCallBack();
                }
            }
        });
        this.TargetElement.addEventListener("keyup", function (eve) {
            if (+self.TargetElement.value > +self.TargetElement.max) {
                self.TargetElement.value = +self.TargetElement.max;
            }
            else if (+self.TargetElement.value < +self.TargetElement.min) {
                self.TargetElement.value = +self.TargetElement.min;
            }

            if (!!self.ValueChangeCallBack) {
                self.ValueChangeCallBack();
            }
        });

        this.TargetElement.addEventListener("change", function (eve) {
            if (!!self.ValueChangeCallBack) {
                self.ValueChangeCallBack();
            }
        });

      
    };

    // init
    this.Init = function (containerElement, valueChangeCallBack) {
        var downElement = containerElement.querySelector("[data-minus]");
        var upElement = containerElement.querySelector("[data-plus]");
        var targetElement = containerElement.querySelector("input[type='number']");
        this.Extend(downElement, upElement, targetElement, valueChangeCallBack);
    }
};


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

//# sourceMappingURL=shopingcart-detail.bundle.js.map
