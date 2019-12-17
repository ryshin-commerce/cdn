"use strict";
var btnShowDetailModel, orderPopupId, btnsShowDetails;
document.addEventListener("DOMContentLoaded",
    function () {
        btnShowDetailModel = document.getElementById("btnShowDetailModel");
        orderPopupId = document.getElementById("orderPopupId");
        btnsShowDetails = document.getElementsByName("BtnShowDetail");

        for (var i = 0; i < btnsShowDetails.length; i++) {
            btnsShowDetails[i].addEventListener("click",
                function (eve) {
                    debugger;
                    reloadLazyDetail(eve.target.dataset.orderId);
                });
        }
    });

function reloadLazyDetail(orderId) {
    orderPopupId.value = orderId;
    btnShowDetailModel.click();
}

