var btnSearchProductName;

document.addEventListener("DOMContentLoaded",
    function () {
     
    });


function flashsaleCoutDown(containerSelector) {
    var container = document.querySelector(containerSelector);
 
    if (!container) {
        return;
    }

    var flashSaleElements = container.querySelectorAll("[data-flash-deal-count-down]");

    for (var i = 0; i < flashSaleElements.length; i++) {
        var widget = Site.FindParent(flashSaleElements[i], "_p-product-widget");
        checkTimeCountDown(containerSelector+" [data-product-id='" + widget.dataset.productId + "']");
    }
}



function loadProductSlider(containerSelector, prevElSelector, nextElSelector, slidesPerView, slidesPerColumn) {
    new Swiper(containerSelector , {
        spaceBetween: 0,
        slidesPerView: slidesPerView,
        slidesPerColumn: slidesPerColumn,
        navigation: {
            prevEl: prevElSelector,
            nextEl: nextElSelector
        }
    });
}

function submitProductWidgetAction() {
}