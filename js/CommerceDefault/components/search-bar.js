var btnSearchProductName, frmHearderSearch;
var shopingcartElement, chkShowHideSearchForm;

document.addEventListener("DOMContentLoaded",
    function () {
        initSearchBar();

        chkShowHideSearchForm = document.getElementById("chkShowHideSearchForm");
    });

function initSearchBar() {
    btnSearchProductName = document.getElementById("btnSearchProductName");
    frmHearderSearch = document.getElementById("frmHearderSearch");
    $('#autocomplete').autocomplete({
        appendTo: "#suggestListContainer",
        serviceUrl: '/product/searchproductautocomplete',
        //lookup: theData,
        deferRequestBy: 250,
        minChars: 3,
        noCache: true,
        onSelect: function (suggestion) {

        },
        showNoSuggestionNotice: true,
        noSuggestionNotice: 'Không tìm thấy sản phẩm',
        formatResult: function (suggestion, currentValue) {   
            return "<a href='" +
                suggestion.data.url +
                "'><div class='inline-block _image-wrap'><img width='40' height='40' src='" +
                suggestion.data.image +
                "' /></div><div data-product-name>" +
                suggestion.value +
                "</div></a>";
        },
        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },
        onSearchStart: function (query) {
            Site.AddClassElement(btnSearchProductName, "active");
        },
        onSearchComplete: function (query, suggestions) {
            Site.RemoveClassElement(btnSearchProductName, "active");
            Site.AddClassElement(frmHearderSearch, "showResult");
          
        },
        onHide: function (container) {
            Site.RemoveClassElement(frmHearderSearch, "showResult");
        }
    });
}

var scrollPos = 0;


window.onscroll = function (e) {
    if (!Site.LockOnsCroll) {
        updateZDocActive();
    }
};

function updateZDocActive() {

    shopingcartElement = document.querySelector("[data-container-shoping-cart]");
    var headerElement = document.querySelector("[data-head]");

    var searchContainer = document.querySelector("[data-search-container-1]");

    if (!!searchContainer) {
        searchContainer.classList.add("hide");
    }    

    if (document.documentElement.scrollTop + document.body.scrollTop === 0) {
        headerElement.classList.add("_showNavigatorBar");
        shopingcartElement.classList.add("_showNavigatorBar");
    } else {
        headerElement.classList.remove("_showNavigatorBar");
        shopingcartElement.classList.remove("_showNavigatorBar");
    }

    if (document.body.scrollTop > headerElement.offsetHeight + 750 || document.documentElement.scrollTop > headerElement.offsetHeight + 750) {
        headerElement.classList.add("_zDocActive");


        if ((document.body.getBoundingClientRect()).top > scrollPos) {
            headerElement.classList.remove("hide");
            //up
        }
        else if (Site.IsDesktopBackend() || !document.body.classList.contains("_model-show")) {
            var inputForcus = document.querySelector("input:focus");
            if (!inputForcus) {
                headerElement.classList.add("hide");
            }
        }


    } else {
        headerElement.classList.remove("_zDocActive");
        headerElement.classList.remove("hide");
        //down
        //headerElement.querySelector("[data-search-container]").classList.remove("hide");
    }

    // saves the new position for iteration.
    scrollPos = (document.body.getBoundingClientRect()).top;
}


