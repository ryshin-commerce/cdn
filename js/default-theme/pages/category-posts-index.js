"use strict";
var listQuantities, chkOutOfStock, txtQuantity, attribute1Items, attribute2Items, productClassificationId, dataPrice, newestPostsContainer;
var btnReloadListProductByClassification, btnReloadListProductLazy, inputClassificationForms, inputProductAttributeForms;
var activeCategoryAttributes, curentPageClassification, curentPageProductAttribute, pageSizeFields;
document.addEventListener("DOMContentLoaded",
    function () {
        init();
        innitCheckboxFilter();
        initNoUiSlider();
        reloadListProductComplete();
    });

function init() {
    activeCategoryAttributes = true;
    btnReloadListProductByClassification = document.getElementById("btnReloadListProductByClassification");
    btnReloadListProductLazy = document.getElementById("btnReloadListProductLazy");
    inputClassificationForms = document.querySelectorAll("#frmLoadComplexCategoryProductByClassification [name^=AttributeModels]");
    inputProductAttributeForms = document.querySelectorAll("#frmLoadComplexCategoryProductByCategoryAttributes [name^=AttributeModels]");
    pageSizeFields = document.querySelectorAll("[name=PageSize]");
    curentPageClassification = document.querySelector("#frmLoadComplexCategoryProductByClassification [name=CurentPage]");
    curentPageProductAttribute = document.querySelector("#frmLoadComplexCategoryProductByCategoryAttributes [name=CurentPage]");
}

function initNoUiSlider() {
    document.querySelectorAll('._id-nouirange').forEach(function (el) {
        let htmlinsert = document.createElement('div');
        let realmininput = el.querySelector('._id-min');
        let realmaxinput = el.querySelector('._id-max');
        realmininput.style.display = "none ";
        realmaxinput.style.display = "none ";
        let min = realmininput.getAttribute('min');
        let max = realmaxinput.getAttribute('max');
        el.appendChild(htmlinsert);

        el.noUiSlider = noUiSlider.create(htmlinsert,
            {
                start: [realmininput.value, realmaxinput.value],
                connect: true,
                step: 1,
                tooltips: true,
                format: wNumb({
                    decimals: 0
                }),
                range: {
                    'min': Number(min),
                    'max': Number(max)
                }
            });
        htmlinsert.noUiSlider.on('change',
            function(values) {
                let rangevals = values;
                realmininput.value = String(values[0]);
                realmaxinput.value = String(values[1]);
                realmininput.dispatchEvent(new Site.CreateEvent("change"));
            });
    });
}

function innitCheckboxFilter() {
    

    for (let i = 0; i < inputClassificationForms.length; i++) {
        inputClassificationForms[i].addEventListener("change", function (eve) {
            loadDefaultValuesGroup2();

            const curentPage = document.querySelector("#frmLoadComplexCategoryProductByClassification [name=CurentPage]");
            curentPage.value = 0;
            btnReloadListProductByClassification.click();
            activeCategoryAttributes = false;
            console.log("Group 1 change");
        });
    }

    

    for (let i = 0; i < inputProductAttributeForms.length; i++) {
        inputProductAttributeForms[i].addEventListener("change", function (eve) {
            loadDefaultValuesGroup1();

            const curentPage = document.querySelector("#frmLoadComplexCategoryProductByCategoryAttributes [name=CurentPage]");
            curentPage.value = 0;
            btnReloadListProductLazy.click();
            activeCategoryAttributes = true;
            console.log("Group 2 change");
        });
    }
}

function loadDefaultValuesGroup2() {

    document.querySelectorAll('#frmLoadComplexCategoryProductByCategoryAttributes input[type=checkbox]').forEach(function (el) {
        el.checked = false;
    });

    document.querySelectorAll('#frmLoadComplexCategoryProductByCategoryAttributes ._id-nouirange').forEach(function (el) {
        el.noUiSlider.reset();
    });
}

function loadDefaultValuesGroup1() {
    document.querySelectorAll('#frmLoadComplexCategoryProductByClassification input[type=checkbox]').forEach(function (el) {
        el.checked = false;
    });

    document.querySelectorAll('#frmLoadComplexCategoryProductByClassification ._id-nouirange').forEach(function(el) {
        el.noUiSlider.reset();
    });
}


function reloadListProductComplete() {
    Pagination.Run();
    var pagingBtns = document.querySelectorAll("#pagination button");

    for (var i = 0; i < pagingBtns.length; i++) {
        pagingBtns[i].addEventListener("click", function(eve) {
            if (!!activeCategoryAttributes) {
                curentPageProductAttribute.value = eve.target.dataset.value;
                btnReloadListProductLazy.click();
                activeCategoryAttributes = true;
            } else {
                curentPageClassification.value = eve.target.dataset.value;
                btnReloadListProductByClassification.click();
                activeCategoryAttributes = false;
            }
        });
    }

    var pageSizes = document.querySelectorAll("[data-page-size]");
    for (var i = 0; i < pageSizes.length; i++) {
        pageSizes[i].addEventListener("click", function (eve) {
            for (var j = 0; j < pageSizeFields.length; j++) {
                pageSizeFields[j].value = eve.target.dataset.pageSize;
            }

            if (!!activeCategoryAttributes) {
                btnReloadListProductLazy.click();
                activeCategoryAttributes = true;
            } else {
                btnReloadListProductByClassification.click();
                activeCategoryAttributes = false;
            }
        });
    }

    
}