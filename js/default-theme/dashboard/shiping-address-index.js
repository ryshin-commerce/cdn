"use strict";
var btnReloadListShippingAddress;
document.addEventListener("DOMContentLoaded",
    function () {
        loadCleave();
        btnReloadListShippingAddress = document.getElementById("btnReloadListShippingAddress");
    });


function loadCleave() {
    var mobileElements = document.getElementsByName('ReceivePhone');

    for (var i = 0; i < mobileElements.length; i++) {
        mobileElements[i].cleave = new Cleave(mobileElements[i], {
            numericOnly: true,
            delimiters: [' ', ' ', ' ', ' '],
            prefix: '+84',
            blocks: [3, 3, 3, 5]
        });
    }
}

function lazyLoadListShippingAddressComplete() {
    loadCleave();
}

function addUpdateShippingAddressComplete() {
    btnReloadListShippingAddress.click();
}
