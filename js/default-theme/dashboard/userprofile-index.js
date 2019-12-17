"use strict";

var content1,
    content2,
    btnCancel,
    btnSubmitPlaceId,
    btnSubmitAvarta,
    avartaInputFile,
    base64Image,
    imgAvarta;

document.addEventListener("DOMContentLoaded",
    function () {
        initUserProfileIndex();
        loadCleave();
        loadAvarta();
    });

function initUserProfileIndex() {
    content1 = document.getElementById('content1');
    content2 = document.getElementById('content2');
    btnCancel = document.getElementById('btnCancel');
    btnSubmitPlaceId = document.getElementById('btnSubmitPlaceId');
    btnSubmitAvarta = document.getElementById('btnSubmitAvarta');
    avartaInputFile = document.getElementById("avartaUpload");
    base64Image = document.getElementById("base64Image");
    imgAvarta = document.getElementById("imgAvarta");
};

function loadCleave() {
    var mobileElement = document.getElementById('BasicUserInfoViewModel_PhoneNumber');

    var phoneNumber = new Cleave(mobileElement, {
        numericOnly: true,
        delimiters: [' ', ' ', ' ', ' '],
        prefix: '+84',
        blocks: [3, 3, 3, 5]
    });

    var birthDay = new Cleave("#BasicUserInfoViewModel_Birthday", {
        date: true,
        datePattern: ['d', 'm', 'Y']
    });
}

function loadAvarta() {

    var el = document.getElementById('resizeContainer');
    var resize = new Croppie(el, {
        viewport: { width: 80, height: 80 },
        boundary: { width: 160, height: 120 },
        showZoomer: true,
        enableResize: false,
        enableOrientation: true
    });

    avartaInputFile.addEventListener("change", function (eve) {
        if (eve.target.files && eve.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                content1.classList.add("hide");
                content2.classList.remove("hide");

                resize.bind({
                    url: e.target.result
                });
            };

            reader.readAsDataURL(eve.target.files[0]);
        }
    });

    btnCancel.addEventListener("click", function (eve) {
        content1.classList.remove("hide");
        content2.classList.add("hide");
    });


    btnSubmitAvarta.addEventListener("click", function (eve) {
        resize.result('base64').then(function (base64) {
            base64Image.value = base64;
        });
    });
}

function ChangeAvarta(data, status) {
    if (status === 'success') {
        imgAvarta.src = data + "?clearcache=" + (new Date()).getTime();
        btnCancel.click();
    }
}
