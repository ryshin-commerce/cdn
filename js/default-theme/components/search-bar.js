var btnSearchProductName;

document.addEventListener("DOMContentLoaded",
    function () {
        initSearchBar();
        
    });

function initSearchBar() {
    btnSearchProductName = document.getElementById("btnSearchProductName");
    $('#autocomplete').autocomplete({
        appendTo:"#suggestListContainer",
        serviceUrl: '/product/searchproductautocomplete',
        //lookup: theData,
        deferRequestBy: 250,
        minChars:3,
        noCache:true,
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
        onSearchStart: function(query) {
            Site.AddClassElement(btnSearchProductName, "active");
        },
        onSearchComplete: function(query, suggestions) {
            Site.RemoveClassElement(btnSearchProductName, "active");
        }
    });
}

