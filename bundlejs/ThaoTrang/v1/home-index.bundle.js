"use strict";function TabPages(){this.Extend=function(e,t,a){var o=e.dataset.activeTabNumber;this.SelectedTabNumber=+o||-1,this.NavElement=e,this.Tabs=t,this.TabContains=a,this.Process()},this.Process=function(){for(var o=this,e=0;e<this.Tabs.length;e++)this.Tabs[e].addEventListener("click",function(e){if(e.currentTarget.dataset.tabUrl&&history.replaceState(null,null,e.currentTarget.dataset.tabUrl),o.SelectedTabNumber=+e.currentTarget.dataset.tab||-1,o.NavElement.dataset.activeTabNumber=o.SelectedTabNumber,Site.BeLazyRevalidate(),e.currentTarget.dataset.callback){for(var t=null,a=0;a<o.TabContains.length;a++)if(o.TabContains[a].dataset.tabContent===e.currentTarget.dataset.tab){t=o.TabContains[a];break}Site.GetFunction(e.currentTarget.dataset.callback,["tabNumber","tabContainerElement"]).apply(e.currentTarget,[o.SelectedTabNumber,t])}})},this.Init=function(e){var t=document.querySelector(e);if(t){var a=t.parentNode.querySelectorAll("[data-tab]"),o=t.parentNode.querySelectorAll("[data-tab-content]");this.Extend(t,a,o)}}}function loadSuggestProducts(){var e=LocalStorageHelper.Get(LocalStorageNamesEnum.UserCategoryList).sort(function(e,t){return 5*e.InOrderCount+3*e.CompleteCount+2*e.AddToCartCount+e.ViewCount>5*t.InOrderCount+3*t.CompleteCount+2*t.AddToCartCount+t.ViewCount?1:-1});e.length=Math.min(3,e.length);for(var t=document.querySelector("#formLazySuggestProduct #inputContainer"),a="",o=0;o<e.length;o++){a+='<input class="hide" type="text" name="CategoryLogModels['+o+'].CategoryId" value="'+e[o].CategoryId+'">'+('<input class="hide" type="number" name="CategoryLogModels['+o+'].ViewCount" value="'+e[o].ViewCount+'">')+('<input class="hide" type="number" name="CategoryLogModels['+o+'].AddToCartCount" value="'+e[o].AddToCartCount+'">')+('<input class="hide" type="number" name="CategoryLogModels['+o+'].InOrderCount" value="'+e[o].InOrderCount+'">')+('<input class="hide" type="number" name="CategoryLogModels['+o+'].CompleteCount" value="'+e[o].CompleteCount+'">')}t.innerHTML=a,document.getElementById("btnReloadSuggestProduct").click()}function loadUserViewedProduct(){var e=LocalStorageHelper.Get(LocalStorageNamesEnum.ViewProductClassificationIds);if(e&&e.length){for(var t=document.querySelector("#productViewedContainer"),a=0;a<e.length;a++){var o=e[a],n='<a href="[ProductUrl]" title="[ProductName]" class="_image-wrap -tablet-margin-bottom rounded-4 border-1 solid border-silver padding-5"> <img alt="[ProductName]" class="b-lazy" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src="[ProductThumnailUrl]"></a>';n=(n=(n=n.replace(/\[ProductUrl\]/g,o.ProductUrl)).replace(/\[ProductName\]/g,o.ProductName)).replace(/\[ProductThumnailUrl\]/g,o.ProductThumnailUrl),o=Site.HtmlToElement(n),t.appendChild(o[0])}Site.BeLazyRevalidate()}}var fileUploadNewReview,imputDocumentFile,btnSearchProductName,btnLazyLoadProducts,tabs,imageCaptcha;function lazyLoadVideo(e){Site.InnitPopup(e)}function uploadVideo(e){Site.AddAttribute("#objVideoUrl","data","https://www.youtube.com/embed/"+e.event.target.dataset.videoId+"?html5=1&autoplay=1&amp;rel=0&amp;hl=vi_US&amp;version=3")}function stopVideo(e){Site.AddAttribute("#objVideoUrl","data","https://www.youtube.com/embed/stop")}function flashsaleCoutDown(e){var t=document.querySelector(e);if(t)for(var a=t.querySelectorAll("[data-flash-deal-count-down]"),o=0;o<a.length;o++){var n=Site.FindParent(a[o],"_p-product-widget");checkTimeCountDown(e+" [data-product-id='"+n.dataset.productId+"']")}}function loadProductSlider(e,t,a,o,n){new Swiper(e,{spaceBetween:5,slidesPerView:o,slidesPerColumn:n,navigation:{prevEl:t,nextEl:a}})}function submitProductWidgetAction(){}function init(){}function loadTabpage(){var e=new TabPages;e.Init("[data-tab-left2-right2-center1] [data-active-tab-number]"),e.Tabs[e.SelectedTabNumber-1].click();var t=new TabPages;t.Init("[data-tab-widget] [data-active-tab-number]"),t.Tabs[t.SelectedTabNumber-1].click()}function lazyLoadFlashsale(){var e=document.getElementById("btnLazyLoadFlashSale");e&&e.click()}function loadFlashSaleSwiper(){widgetFlashSaleSwiper(2,4,5)}function loadSwipper(){for(var e=Site.IsMobileBackend()?2:8,t=(new Swiper("[data-main-section] [data-container-slider] .swiper-container",{spaceBetween:0,centeredSlides:!0,loop:!1,autoplay:{delay:3e3,disableOnInteraction:!0},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}}),document.querySelectorAll("[data-slider-type1]")),a=0;a<t.length;a++){var o=t[a],n=(e=Site.IsMobileBackend()?1:o.dataset.numberSliders,Site.IsMobileBackend()?1:o.dataset.spaceBetween);new Swiper('[data-slider-type1="'+o.dataset.sliderType1+'"] [data-container-slider] .swiper-container',{spaceBetween:+n,slidesPerView:+e,loop:!1,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},pagination:{el:".swiper-pagination"}})}}function lazyLoadProductCategory(){for(var e=document.querySelectorAll("[data-selector-lazyload-products] button"),t=0;t<e.length;t++)e[t].click()}function loadCategoryComplete(e){new Swiper(e+" .swiper-container",{spaceBetween:0,slidesPerView:4,slidesPerColumn:2,slidesPerGroup:4,centeredSlides:!1,loop:!1,autoplay:{delay:3e3,disableOnInteraction:!1},navigation:{nextEl:"._swiper-button-prev",prevEl:"._swiper-button-next"}})}document.addEventListener("DOMContentLoaded",function(){loadUserViewedProduct()}),document.addEventListener("DOMContentLoaded",function(){}),document.addEventListener("DOMContentLoaded",function(){init(),loadTabpage(),loadSwipper(),loadProductSlider("[data-sec-product-1] [data-col-1] ._id-listProduct","[data-sec-product-1] [data-col-1] ._swiper-button-prev","[data-sec-product-1] [data-col-1] ._swiper-button-next",Site.IsMobileBackend()?2:1,3),loadProductSlider("[data-sec-product-1] [data-col-2] ._id-listProduct","[data-sec-product-1] [data-col-2] ._swiper-button-prev","[data-sec-product-1] [data-col-2] ._swiper-button-next",Site.IsMobileBackend()?2:1,3),lazyLoadFlashsale(),lazyLoadProductCategory(),loadSuggestProducts()});