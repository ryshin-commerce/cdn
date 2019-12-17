"use strict";
var myList, txtPhone, txtAddress, txtId, txtFullName, phoneNumberCleave;
document.addEventListener("DOMContentLoaded",
    function () {
        initPayment();
        loadCleave();
        loadAutoComplete();
    });

function initPayment() {
    myList = document.getElementById("mylist");
    txtPhone = document.getElementById("OrderViewModel_PhoneNumber");
    txtAddress = document.getElementById("OrderViewModel_Address");
    txtId = document.getElementById("OrderViewModel_ShippingAddressId");
    txtFullName = document.getElementById("OrderViewModel_FullName");

}

function loadCleave() {
    var mobileElement = document.getElementById('OrderViewModel_PhoneNumber');

    phoneNumberCleave = new Cleave(mobileElement, {
        numericOnly: true,
        delimiters: [' ', ' ', ' '],
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
