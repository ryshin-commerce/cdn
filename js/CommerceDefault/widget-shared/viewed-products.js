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