"use strict";function loadSuggestProducts(){var e=document.querySelector("#formLazySuggestProduct #inputContainer");if(e){var t=LocalStorageHelper.Get(LocalStorageNamesEnum.UserCategoryList).sort(function(e,t){return 5*e.InOrderCount+3*e.CompleteCount+2*e.AddToCartCount+e.ViewCount>5*t.InOrderCount+3*t.CompleteCount+2*t.AddToCartCount+t.ViewCount?1:-1});t.length=Math.min(3,t.length);for(var o="",a=0;a<t.length;a++){o+='<input class="hide" type="text" name="CategoryLogModels['+a+'].CategoryId" value="'+t[a].CategoryId+'">'+('<input class="hide" type="number" name="CategoryLogModels['+a+'].ViewCount" value="'+t[a].ViewCount+'">')+('<input class="hide" type="number" name="CategoryLogModels['+a+'].AddToCartCount" value="'+t[a].AddToCartCount+'">')+('<input class="hide" type="number" name="CategoryLogModels['+a+'].InOrderCount" value="'+t[a].InOrderCount+'">')+('<input class="hide" type="number" name="CategoryLogModels['+a+'].CompleteCount" value="'+t[a].CompleteCount+'">')}e.innerHTML=o,document.getElementById("btnReloadSuggestProduct").click()}}function loadUserViewedProduct(){var e=LocalStorageHelper.Get(LocalStorageNamesEnum.ViewProductClassificationIds);if(e&&e.length){var t=document.querySelector("#productViewedContainer"),o=e.length;t.dataset.itemCount&&(o=Math.min(o,t.dataset.itemCount));for(var a=0;a<o;a++){var n=e[a],r='<a href="[ProductUrl]" title="[ProductName]" class="_image-wrap -tablet-margin-bottom rounded-4 border-1 solid border-silver padding-5"> <img alt="[ProductName]" loading="lazy" class="r-lazy" src="[ProductThumnailUrl]"></a>';r=(r=(r=r.replace(/\[ProductUrl\]/g,n.ProductUrl)).replace(/\[ProductName\]/g,n.ProductName)).replace(/\[ProductThumnailUrl\]/g,n.ProductThumnailUrl),n=Site.HtmlToElement(r),t.appendChild(n[0])}}}var fileUploadNewReview,imputDocumentFile,btnSearchProductName,btnLazyLoadProducts,tabs,imageCaptcha;function lazyLoadVideo(e){Site.InnitPopup(e)}function uploadVideo(e){Site.AddAttribute("#objVideoUrl","data","https://www.youtube.com/embed/"+e.event.target.dataset.videoId+"?html5=1&autoplay=1&amp;rel=0&amp;hl=vi_US&amp;version=3")}function stopVideo(e){Site.AddAttribute("#objVideoUrl","data","https://www.youtube.com/embed/stop")}function flashsaleCoutDown(e){var t=document.querySelector(e);if(t)for(var o=t.querySelectorAll("[data-flash-deal-count-down]"),a=0;a<o.length;a++){var n=Site.FindParent(o[a],"_p-product-widget");checkTimeCountDown(e+" [data-product-id='"+n.dataset.productId+"']")}}function loadProductSlider(e,t,o,a,n){new Swiper(e,{spaceBetween:5,slidesPerView:a,slidesPerColumn:n,navigation:{prevEl:t,nextEl:o}})}function submitProductWidgetAction(){}function init(){}function lazyLoadFlashsale(){document.getElementById("btnLazyLoadFlashSale").click()}function loadFlashSaleSwiper(){widgetFlashSaleSwiper(2,4,5)}function loadSwipper(){var e=Site.IsMobileBackend()?2:8;new Swiper("[data-brand-name] .swiper-container",{spaceBetween:20,slidesPerView:e,centeredSlides:!1,loop:!1,autoplay:{delay:3e3,disableOnInteraction:!1},navigation:{nextEl:".swiper-button-next-brand",prevEl:".swiper-button-prev-brand"}});e=Site.IsMobileBackend()?1:2;new Swiper(".swiper-container-review",{spaceBetween:0,slidesPerView:e,centeredSlides:!1,loop:!1,autoplay:{delay:3e3,disableOnInteraction:!1},navigation:{nextEl:"._swiper-button-prev",prevEl:"._swiper-button-next"}}),new Swiper("[data-container-slider] .swiper-container",{spaceBetween:0,centeredSlides:!0,loop:!1,autoplay:{delay:3e3,disableOnInteraction:!1},navigation:{nextEl:"._swiper-button-prev",prevEl:"._swiper-button-next"}})}function lazyLoadProductCategory(){for(var e=document.querySelectorAll("[data-selector-lazyload-products] button"),t=0;t<e.length;t++)e[t].click()}function loadCategoryComplete(e){new Swiper(e+" .swiper-container",{spaceBetween:0,slidesPerView:4,slidesPerColumn:2,slidesPerGroup:4,centeredSlides:!1,loop:!1,autoplay:{delay:3e3,disableOnInteraction:!1},navigation:{nextEl:"._swiper-button-prev",prevEl:"._swiper-button-next"}})}document.addEventListener("DOMContentLoaded",function(){loadUserViewedProduct()}),document.addEventListener("DOMContentLoaded",function(){}),document.addEventListener("DOMContentLoaded",function(){init(),loadSwipper(),loadProductSlider("[data-sec-product-1] [data-col-1] ._id-listProduct","[data-sec-product-1] [data-col-1] ._swiper-button-prev","[data-sec-product-1] [data-col-1] ._swiper-button-next",Site.IsMobileBackend()?2:1,3),loadProductSlider("[data-sec-product-1] [data-col-2] ._id-listProduct","[data-sec-product-1] [data-col-2] ._swiper-button-prev","[data-sec-product-1] [data-col-2] ._swiper-button-next",Site.IsMobileBackend()?2:1,3),lazyLoadFlashsale(),lazyLoadProductCategory(),loadSuggestProducts()});