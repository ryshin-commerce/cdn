"use strict";
var listQuantities, chkOutOfStock, txtQuantity, attribute1Items, attribute2Items, productClassificationId, dataPrice, newestPostsContainer;
var btnReloadListProductByClassification, btnReloadListProductLazy, inputClassificationForms, inputProductAttributeForms;
var activeCategoryAttributes, curentPageClassification, curentPageProductAttribute, pageSizeFields;
var lockScrollNexProduct = false;
document.addEventListener("DOMContentLoaded",
    function () {
        init();

        if (!!document.querySelector("#frmLoadComplexCategoryProductByClassification [data-active-tab-number]")) {
            var tab1s = new TabPages();
            tab1s.Init("#frmLoadComplexCategoryProductByClassification [data-active-tab-number]");
        }

        if (!!document.querySelector("#frmLoadComplexCategoryProductByCategoryAttributes [data-active-tab-number]")) {
            var tab2s = new TabPages();
            tab2s.Init("#frmLoadComplexCategoryProductByCategoryAttributes [data-active-tab-number]");
        }
      

        Site.BindingOnCroll();
        innitCheckboxFilter(Site.IsDesktopBackend());

        if (!Site.IsDesktopBackend()) {
            var btnFillter = document.getElementById("btnMobileSubmitFake");
            btnFillter.addEventListener("click", function() {
                if (!!activeCategoryAttributes) {
                    btnReloadListProductLazy.click();
                    activeCategoryAttributes = true;
                } else {
                    btnReloadListProductByClassification.click();
                    activeCategoryAttributes = false;
                }

                Site.ClosePopup();
            });
        }

        initNoUiSlider();
        reloadListProductComplete();
       
        //for brand only
        initBrand();
        loadSuggestProducts();
    });

function loadProductWidget() {
    debugger;
}

function reloadNextProduct() {
  
    if (!Pagination.page ||lockScrollNexProduct || Pagination.page >= Pagination.size) {
        return;
    }
    lockScrollNexProduct = true;
  
    var formName;
    if (!!activeCategoryAttributes) {
        formName = "frmLoadComplexCategoryProductByCategoryAttributes";
        curentPageProductAttribute.value = Pagination.page+1;
    } else {
        formName = "frmLoadComplexCategoryProductByClassification";
        curentPageClassification.value = Pagination.page+1;
    }

    var nextPage = Pagination.page + 1;
    console.log(nextPage);
    var formElement = document.getElementById(formName);
    var formData = new FormData(formElement);
    formData.append("productWigetOnly", "True");
    AjaxRequest.SendFormData("POST",
        formElement.action, formData,
        function (response, status) {
            var flexContainer = document.querySelector("._flex-container");
            var productWidgets = Site.HtmlToElement(response);

            for (var i = 0; i < productWidgets.length; i++) {
                flexContainer.appendChild(productWidgets[i]);
            }
            Site.bLazy.revalidate();
           
            setTimeout(function () {
                lockScrollNexProduct = false;
                Pagination.Next();
            }, 1000);
           
        },
        function () {
            setTimeout(function () {
                lockScrollNexProduct = false;
            }, 1000);
        });

}

function initBrand() {
    var brandHeader = document.querySelector("[data-brand]");

    if (!!brandHeader) {
        //var backgroundImage = "url("+ brandHeader.dataset.backgroundImage+")";
        //var dataHead = document.querySelector("[data-head]");
        //dataHead.style.backgroundImage = backgroundImage;
        //var dataBlackGround = document.querySelector("[data-main-section] [data-black-row]");
        //dataBlackGround.style.backgroundImage = backgroundImage;
        //var body = document.querySelector("body");
        //body.setAttribute("data-brand-page","");
    }


    var chkSortBys = document.querySelectorAll("[name=sortBy]");
    for (var i = 0; i < chkSortBys.length; i++) {
        chkSortBys[i].addEventListener("change", function (eve) {
            Site.ClosePopup();
            if (eve.target.checked) {
                if (!!activeCategoryAttributes) {
                    const sortbyElement = document.querySelector("#frmLoadComplexCategoryProductByCategoryAttributes [name=ProductSortbyEnum]");
                    sortbyElement.value = eve.target.value;
                    const curentPage = document.querySelector("#frmLoadComplexCategoryProductByCategoryAttributes [name=CurentPage]");
                    curentPage.value = 0;
                    activeCategoryAttributes = true;
                    btnReloadListProductLazy.click();

                } else {
                    const sortbyElement = document.querySelector("#frmLoadComplexCategoryProductByCategoryAttributes [name=ProductSortbyEnum]");
                    sortbyElement.value = eve.target.value;
                    const curentPage = document.querySelector("#frmLoadComplexCategoryProductByClassification [name=CurentPage]");
                    curentPage.value = 0;
                    activeCategoryAttributes = false;
                    btnReloadListProductByClassification.click();
                }
            }
        });
    }

}

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
                tooltips: [WNumbHelper.longNumberFormatShort, WNumbHelper.longNumberFormatShort],
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
    submitProductWidgetAction("._id-listProductPagings");
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
                const curentPage = document.querySelector("#frmLoadComplexCategoryProductByCategoryAttributes [name=CurentPage]");
                curentPage.value = 0;
                activeCategoryAttributes = true;
                btnReloadListProductLazy.click();
            } else {
                activeCategoryAttributes = false;
                const curentPage = document.querySelector("#frmLoadComplexCategoryProductByClassification [name=CurentPage]");
                curentPage.value = 0;
                btnReloadListProductByClassification.click();
            }
        });
    }

    
}