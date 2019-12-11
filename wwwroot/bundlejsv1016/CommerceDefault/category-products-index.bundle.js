/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

function TabPages() {
    // converting initialize data
    this.Extend = function (navElement, tabs, tabContains) {
        var selectTabNumber = navElement.dataset.activeTabNumber;
        this.SelectedTabNumber = +selectTabNumber || -1;
        this.NavElement = navElement;
        this.Tabs = tabs;
        this.TabContains = tabContains;
        this.Process();
    };

    this.Process = function () {
        var self = this;
        for (var i = 0; i < this.Tabs.length; i++) {
            this.Tabs[i].addEventListener("click",
                function (eve) {
                    if (!!eve.currentTarget.dataset.tabUrl) {
                        history.replaceState(null, null, eve.currentTarget.dataset.tabUrl);
                    }
                    self.SelectedTabNumber = +eve.currentTarget.dataset.tab || -1;
                    self.NavElement.dataset.activeTabNumber = self.SelectedTabNumber;

                    Site.BeLazyRevalidate();
                    if (!!eve.currentTarget.dataset.callback) {
                        var tabContentElement = null;
                        for (var j = 0; j < self.TabContains.length; j++) {
                            if (self.TabContains[j].dataset.tabContent === eve.currentTarget.dataset.tab) {
                                tabContentElement = self.TabContains[j];
                                break;
                            }
                        }
                        Site.GetFunction(eve.currentTarget.dataset.callback, ["tabNumber", "tabContainerElement"]).apply(eve.currentTarget, [self.SelectedTabNumber, tabContentElement]);
                    }
                });
        }
    };

    // init
    this.Init = function (selector) {
        var navElement = document.querySelector(selector);

        if (!navElement) {
            return;
        }

        var tabs = navElement.parentNode.querySelectorAll("[data-tab]");
        var tabContents = navElement.parentNode.querySelectorAll("[data-tab-content]");

        this.Extend(navElement, tabs, tabContents);
    };
};/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

var btnSearchProductName;

document.addEventListener("DOMContentLoaded",
    function () {
    });

"use strict";

function loadSuggestProducts() {
    var productClassObjs = LocalStorageHelper.Get(LocalStorageNamesEnum.UserCategoryList).sort(
        (a, b) => (a.InOrderCount * 5 + a.CompleteCount * 3 + a.AddToCartCount * 2 + a.ViewCount >
            b.InOrderCount * 5 + b.CompleteCount * 3 + b.AddToCartCount * 2 + b.ViewCount)
        ? 1
            : -1);
    productClassObjs.length = Math.min(3, productClassObjs.length) ;

    var inputContainer = document.querySelector("#formLazySuggestProduct #inputContainer");
    var html = "";

    for (var i = 0; i < productClassObjs.length; i++) {
        var inputCategoryId = '<input class="hide" type="text" name="CategoryLogModels[' + i + '].CategoryId" value="' + productClassObjs[i].CategoryId + '">';
        var inputViewCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].ViewCount" value="' + productClassObjs[i].ViewCount + '">';
        var inputAddToCartCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].AddToCartCount" value="' + productClassObjs[i].AddToCartCount + '">';
        var inputInOrderCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].InOrderCount" value="' + productClassObjs[i].InOrderCount + '">';
        var inputCompleteCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].CompleteCount" value="' + productClassObjs[i].CompleteCount + '">';
        html += (inputCategoryId + inputViewCount + inputAddToCartCount + inputInOrderCount + inputCompleteCount);
    }

    inputContainer.innerHTML = html;
    document.getElementById("btnReloadSuggestProduct").click();
}

"use strict";

document.addEventListener("DOMContentLoaded",
    function() {
        loadUserViewedProduct();
    });

function loadUserViewedProduct() {
    var productClassObjs = LocalStorageHelper.Get(LocalStorageNamesEnum.ViewProductClassificationIds);

    if (!productClassObjs || !productClassObjs.length) {
        return;
    }

    
    var productViewedContainer = document.querySelector("#productViewedContainer");

    for (var i = 0; i < productClassObjs.length; i++) {
        var productItem = productClassObjs[i];       
        var strElement = '<a href="[ProductUrl]" title="[ProductName]" class="_image-wrap tablet-margin -tablet-margin-bottom rounded-4 border-1 solid border-silver padding-5"> <img alt="[ProductName]" class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="[ProductThumnailUrl]"></a>';
        strElement = strElement.replace(/\[ProductUrl\]/g, productItem.ProductUrl);
        strElement = strElement.replace(/\[ProductName\]/g, productItem.ProductName);
        strElement = strElement.replace(/\[ProductThumnailUrl\]/g, productItem.ProductThumnailUrl);
        productItem = Site.HtmlToElement(strElement);
        productViewedContainer.appendChild(productItem[0]);
    }

    Site.BeLazyRevalidate();
}
/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * https://codepen.io/karpovsystems/pen/fFHxK
 * * * * * * * * * * * * * * * * */

var Pagination = {

    code: '',

    // --------------------
    // Utility
    // --------------------

    // converting initialize data
    Extend: function (data) {
        data = data || {};
        Pagination.size = data.size ? parseInt(data.size) : 0;
        Pagination.page = data.page ? parseInt(data.page) : 0;
        Pagination.step = data.step ? parseInt(data.step) : 0;
        Pagination.tagName = data.tagName || 'a';
        Pagination.attribute = data.attribute || '';
        Pagination.hrefToken = data.hrefToken || '';
        Pagination.showValue = !!data.showValue || false;
        Pagination.submitFromAttributes = data.form != null
            ? ('form="' + data.form + '" type=submit name="PageNumber"')
            : "";
        Pagination.hover = data.hover || '';
        Pagination.itemClassName = '';
        if (!!data.hover) {
            Pagination.itemClassName += " class='hover-tooltip' ";
        }
    },

    // add pages by number (from [s] to [f])
    Add: function (s, f) {
        for (let i = s; i < f; i++) {
            const url = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", i) + '"' : "";
            const value = Pagination.showValue ? 'value="' + i + '"' : "";
            const hoverElement = Pagination.hover
                ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", i) + "</span>" : "";
            Pagination.code += '<li' + Pagination.itemClassName + '><' + Pagination.tagName + ' ' + Pagination.submitFromAttributes + ' ' + url + ' ' + value + ' ' + Pagination.attribute + 'data-value=' + i + ' >' + i + '</' + Pagination.tagName + '>' + hoverElement +'</li>';
        }
    },

    // add last page with separator
    Last: function () {
        const url = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", (Pagination.size > 1 ? Pagination.size : 1)) + '"' : "";
        const value = Pagination.showValue ? 'value="' + (Pagination.size > 1 ? Pagination.size : 1) + '"' : "";
        const hoverElement = Pagination.hover
            ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", (Pagination.size > 1 ? Pagination.size : 1)) + "</span>" : "";
        Pagination.code += '<i>...</i><li data-last ' + Pagination.itemClassName + ' ><' + Pagination.tagName + ' ' + Pagination.submitFromAttributes + ' ' + url + ' ' + value + ' ' + Pagination.attribute + 'data-value=' + Pagination.size + '>' + Pagination.size + '</' + Pagination.tagName + '>' + hoverElement +'</li>';
    },

    // add first page with separator
    First: function () {
        const url = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", 1) + '"' : "";
        const value = Pagination.showValue ? 'value="' + 1 + '"' : "";
        const hoverElement = Pagination.hover
            ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", 1) + "</span>" : "";
        Pagination.code += '<li data-first ' + Pagination.itemClassName + '><' + Pagination.tagName + ' ' + Pagination.submitFromAttributes + ' ' + url + ' ' + value + ' ' + Pagination.attribute + ' data-value=1>1</' + Pagination.tagName + '>' + hoverElement +'</li><i>...</i>';
    },



    // --------------------
    // Handlers
    // --------------------

    // change page
    Click: function () {
        Pagination.page = +this.innerHTML;
        Pagination.Start();
    },

    // previous page
    Prev: function () {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        Pagination.Start();
    },

    // next page
    Next: function (increNumber=1) {
        Pagination.page += increNumber;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        Pagination.Start();
    },



    // --------------------
    // Script
    // --------------------

    // binding pages
    Bind: function () {
        const a = Pagination.e.getElementsByTagName(Pagination.tagName);
        for (let i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === Pagination.page) {
                a[i].parentElement.className = 'current';
            }

            if (!Pagination.submitFromAttributes) {
                a[i].addEventListener('click', Pagination.Click, false);
            }

        }
    },

    // write pagination
    Finish: function () {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },

    // find pagination type
    Start: function () {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        }
        else if (Pagination.page < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        }
        else if (Pagination.page > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        }
        else {
            Pagination.First();
            Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
            Pagination.Last();
        }
        Pagination.Finish();
    },



    // --------------------
    // Initialization
    // --------------------

    // binding buttons
    Buttons: function (e) {
        const nav = e.getElementsByTagName(Pagination.tagName);
        nav[0].addEventListener('click', Pagination.Prev, false);
        nav[1].addEventListener('click', Pagination.Next, false);
    },

    // create skeleton
    Create: function (e) {
        const urlPageStart = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", (Pagination.page > 1 ? Pagination.page - 1 : 1)) + '"' : "";
        const urlPageEnd = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", (Pagination.size > Pagination.page ? Pagination.page + 1 : Pagination.size)) + '"' : "";
        const valueStart = Pagination.showValue ? 'value="' + (Pagination.page > 1 ? Pagination.page - 1 : 1) + '"' : "";
        const valueEnd = Pagination.showValue ? 'value="' + (Pagination.page > 1 ? Pagination.page - 1 : 1) + '"' : "";
        //const hoverElementStart = Pagination.hover
        //    ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", (Pagination.page > 1 ? Pagination.page - 1 : 1)) + "</span>" : "";
        //const hoverElementEnd = Pagination.hover
        //    ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", (Pagination.size > Pagination.page ? Pagination.page + 1 : Pagination.size)) + "</span>" : "";
        const html = [
            '<li' + Pagination.itemClassName + '><' + Pagination.tagName + ' class="pre" ' + Pagination.submitFromAttributes + ' ' + valueStart + ' ' + Pagination.attribute + ' ' + urlPageStart + ' data-value=' + (Pagination.page > 1 ? Pagination.page : 1) + ' >&#9668;</' + Pagination.tagName + '></li>', // previous button
            '<span></span>',  // pagination container
            '<li' + Pagination.itemClassName + '><' + Pagination.tagName + ' class="next" ' + Pagination.submitFromAttributes + ' ' + valueEnd + ' ' + Pagination.attribute + ' ' + urlPageEnd + ' data-value=' + (Pagination.size > Pagination.page ? Pagination.page + 1 : Pagination.size) + ' >&#9658;</' + Pagination.tagName + '></li>'  // next button
        ];

        e.innerHTML = html.join('');
        Pagination.e = e.getElementsByTagName('span')[0];
        Pagination.Buttons(e);
    },

    // init
    Init: function (e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    },
    Run: function () {
        const pagingContainers = document.getElementsByClassName('_p-gination');
        for (let i = 0; i < pagingContainers.length; i++) {
            const ele = pagingContainers[i];
            Pagination.Init(ele, ele.dataset);
        }
    }
};



/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */


document.addEventListener('DOMContentLoaded', Pagination.Run(), false);



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
//# sourceMappingURL=category-products-index.bundle.js.map
