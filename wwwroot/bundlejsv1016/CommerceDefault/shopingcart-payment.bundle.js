"use strict";
var myList, txtPhone, txtAddress, txtId, txtFullName, phoneNumberCleave, btnReloadShopingCartcartDetail, txtCode, txtDiscountcartDetail;
var txtDiscountCode, btnSubmitLoadDiscountCode, frmShipInfo;
var btnSearchWard, txtVnLocationName, txtVnLocationId, spanDataShipAddress;

document.addEventListener("DOMContentLoaded",
    function () {
        initPayment();
        loadCleave();
        loadAutoComplete();
        loadLocationAutoComplete();
        btnReloadShopingCartcartDetail = document.getElementById("btnReloadShopingCartcartDetail");
        btnReloadShopingCartcartDetail.click();
        //frmShipInfo = document.querySelector("#frmShipInfo button");
        //if (!!frmShipInfo) {
        //    frmShipInfo.addEventListener("click", googleEcommerceChecking);
        //}
        updateRealAddress();
    });

//function googleEcommerceChecking() {
//    var productItemElements = document.querySelectorAll("._id-cartcartDetail li");

//    for (var i = 0; i < productItemElements.length; i++) {
//        var productId = productItemElements[i].querySelector("[data-product-id]").dataset.productId;
//        var productName = productItemElements[i].querySelector("[data-product-name]").dataset.productName;
//        var productVariant = productItemElements[i].querySelector("[data-product-class-name]").dataset.productClassName;
//        var productQuantity = productItemElements[i].querySelector("[data-quantity]").dataset.quantity;
//        var productPrice = productItemElements[i].querySelector("[data-price]").dataset.price; 
//        EnhancedEcommerce.AddProduct(productId, productName, productVariant, '', '', productPrice, productQuantity);
//    }
//}

function showAnimation() {
    debugger;
}

function initPayment() {
    myList = document.getElementById("mylist");
    txtPhone = document.getElementById("OrderViewModel_PhoneNumber");
    txtAddress = document.getElementById("OrderViewModel_Address");
    txtAddress.addEventListener("keyup", function (e) {
        updateRealAddress();
    });
    txtId = document.getElementById("OrderViewModel_ShippingAddressId");
    txtFullName = document.getElementById("OrderViewModel_FullName");
    btnSearchWard = document.getElementById("btnSearchWard");
    txtVnLocationName = document.getElementById("OrderViewModel_VnLocationName");
    txtVnLocationId = document.getElementById("OrderViewModel_VnLocationId");

    txtVnLocationName.addEventListener("keyup", function (e) {
        updateVnLocation();
        updateRealAddress();
    });

    txtDiscountCode = document.getElementById("OrderViewModel_DiscountCode");
    spanDataShipAddress = document.querySelector("[data-ship-address]");
    txtDiscountCode.addEventListener("keyup", function (e) {
        uploadCart(e.target.value);

    });
}

function processListItemShopingCartcartDetail() {

}

function uploadCart(codeStr) {

    if (codeStr.length !== 8) {
        return;
    }

    txtCode = document.getElementById("txtCode");
    txtDiscountcartDetail = document.getElementById("txtDiscountcartDetail");
    txtCode.value = codeStr;
    txtDiscountcartDetail.value = codeStr;

    btnReloadShopingCartcartDetail = document.getElementById("btnReloadShopingCartcartDetail");
    btnReloadShopingCartcartDetail.click();

    btnSubmitLoadDiscountCode = document.getElementById("btnSubmitLoadDiscountCode");
    btnSubmitLoadDiscountCode.click();

}

function loadCleave() {
    var mobileElement = document.getElementById('OrderViewModel_PhoneNumber');

    phoneNumberCleave = new Cleave(mobileElement, {
        numericOnly: true,
        delimiters: [' ', ' ', ' '],
        //prefix: '+84',
        blocks: [4, 3, 5]
    });
}

function loadAutoComplete() {
    new Awesomplete('#OrderViewModel_FullName', {
        filter: function (text, input) {
            return Awesomplete.FILTER_CONTAINS(text, input.match(/[^\|]*$/)[0]);
        },

        item: function (text, input) {
            return Awesomplete.ITEM(text, input.match(/[^\|]*$/)[0]);
        },

        replace: function (text) {
            var before = this.input.value.match(/^.+\|\s*|/)[0];
            this.input.value = before + text.value.split('=')[1];
        }
    });

    document.getElementById('OrderViewModel_FullName').addEventListener("awesomplete-selectcomplete", function (event) {
        var id = event.text.value.split("=")[0];
        event.target.value = event.text.value.split("=")[1];
        for (var i = 0; i < myList.options.length; i++) {
            var opt = myList.options[i];
            if (opt.id === id) {
                txtPhone.value = opt.dataset.phone;
                txtAddress.value = opt.dataset.address;
                txtId.value = id;
                console.log('autocomplet');
                loadCleave();
            }

        }
    });

    document.getElementById('OrderViewModel_FullName').addEventListener("change", function (event) {
        console.log("change");
        loadCleave();
    });

}

function updateRealAddress() {
    spanDataShipAddress.innerHTML = !!txtAddress.value
        ? (txtAddress.value + ", " + txtVnLocationName.value).trim()
        : txtVnLocationName.value;
}

function loadLocationAutoComplete() {

    $('#OrderViewModel_VnLocationName').autocomplete({
        appendTo: "#suggestListLocationContainer",
        serviceUrl: '/shopingcart/searchlocationcomplete',
        //lookup: theData,
        deferRequestBy: 100,
        minChars: 3,
        noCache: true,
        onSelect: function (suggestion) {
            updateRealAddress(suggestion);
            txtVnLocationId.value = suggestion.data.id;
            updateVnLocation();
        },
        showNoSuggestionNotice: true,
        noSuggestionNotice: 'Không tìm thấy địa chỉ',
        formatResult: function (suggestion, currentValue) {
            return "<div class='padding-5  _cursor-poiter' level=" + suggestion.data.level + " data-vnlocation-id='" + suggestion.data.id + "'>" +
                suggestion.value +
                "</div>";
        },
        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },
        onSearchStart: function (query) {
            Site.AddClassElement(btnSearchWard, "active");
            txtVnLocationId.value = "";
        },
        onSearchComplete: function (query, suggestions) {
            Site.RemoveClassElement(btnSearchWard, "active");
        }
    });
}

function updateVnLocation() {
    var curentVnLocationId = txtVnLocationId.value;
    var vnLocationCartDetailId = document.querySelector("#frmLazyLoadShopingCartcartDetail [name=vnLocationId]");
    var messageElement = document.querySelector("#frmLazyLoadShopingCartcartDetail [data-order-message]");

    if (!!curentVnLocationId) {
        if (curentVnLocationId != vnLocationCartDetailId.value) {
            vnLocationCartDetailId.value = curentVnLocationId;
            var totalDetailElement = document.querySelector("[data-weight]");

            AjaxRequest.SendRequestGetJson("POST",
                "shopingcart/getshipfree",
                {
                    "vnLocationId": curentVnLocationId,
                    "sumdiscount": totalDetailElement.dataset.sumReal,
                    "totalWeight": totalDetailElement.dataset.weight
                },
                function (e, v) {
                    var responseObject = JSON.parse(e);
                    var messageEle = document.getElementById("message");
                    var suggestMessageEle = document.getElementById("suggestMessage");
                    var delShipPriceEle = document.getElementById("delShipPrice");
                    var shipPriceEle = document.getElementById("shipPrice");
                    var delTotalEle = document.getElementById("delTotal");
                    var totalEle = document.getElementById("total");
                 
                    messageEle.innerText = responseObject.message;
                    suggestMessageEle.innerText = responseObject.suggestMessage;

                    var shipFee = responseObject.normalShipPrice - ((responseObject.maxSupportNormalShipPrice === 0 ? responseObject.normalShipPrice : responseObject.maxSupportNormalShipPrice) * responseObject.shipDiscountPercent / 100);
                    delShipPriceEle.parentNode.classList.add(responseObject.shipDiscountPercent > 0 ? "visible" : "hidden");

                    delShipPriceEle.innerText = WNumbHelper.GetFrNumber(responseObject.normalShipPrice);
                    shipPriceEle.innerText = WNumbHelper.GetFrNumber(shipFee);


                    var sumdiscount = +totalDetailElement.dataset.sumReal;
                    var summoney = +totalDetailElement.dataset.sumTemp;
                    delTotalEle.parentNode.classList.add((responseObject.shipDiscountPercent > 0 || sumdiscount !== summoney) ? "visible" : "hidden");

                    delTotalEle.innerText = WNumbHelper.GetFrNumber(responseObject.normalShipPrice + summoney);
                    totalEle.innerText = WNumbHelper.GetFrNumber(sumdiscount+shipFee);

                });
        }
        //uploadCart(txtDiscountCode.value);
    } else {
        if (!!vnLocationCartDetailId) {
            vnLocationCartDetailId.value = "";
        }
    }
}
//# sourceMappingURL=shopingcart-payment.bundle.js.map
