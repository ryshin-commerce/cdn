"use strict";function TabPages(){this.Extend=function(e,t,a){var n=e.dataset.activeTabNumber;this.SelectedTabNumber=+n||-1,this.NavElement=e,this.Tabs=t,this.TabContains=a,this.Process()},this.Process=function(){for(var n=this,e=0;e<this.Tabs.length;e++)this.Tabs[e].addEventListener("click",function(e){if(e.currentTarget.dataset.tabUrl&&history.replaceState(null,null,e.currentTarget.dataset.tabUrl),n.SelectedTabNumber=+e.currentTarget.dataset.tab||-1,n.NavElement.dataset.activeTabNumber=n.SelectedTabNumber,e.currentTarget.dataset.callback){for(var t=null,a=0;a<n.TabContains.length;a++)if(n.TabContains[a].dataset.tabContent===e.currentTarget.dataset.tab){t=n.TabContains[a];break}Site.GetFunction(e.currentTarget.dataset.callback,["tabNumber","tabContainerElement"]).apply(e.currentTarget,[n.SelectedTabNumber,t])}})},this.Init=function(e){var t,a=document.querySelector(e);a&&(t=a.parentNode.querySelectorAll("[data-tab]"),e=a.parentNode.querySelectorAll("[data-tab-content]"),this.Extend(a,t,e))}}var btnSearchProductName,fileUploadNewReview,imputDocumentFile,btnLazyLoadProducts,tabs,imageCaptcha;function lazyLoadVideo(e){Site.InnitPopup(e)}function uploadVideo(e){Site.AddAttribute("#objVideoUrl","data","https://www.youtube.com/embed/"+e.event.target.dataset.videoId+"?html5=1&autoplay=1&amp;rel=0&amp;hl=vi_US&amp;version=3")}function stopVideo(e){Site.AddAttribute("#objVideoUrl","data","https://www.youtube.com/embed/stop")}function initContactForm(){(imageCaptcha=document.querySelector("[data-captcha-container] ._image-wrap"))&&imageCaptcha.addEventListener("click",function(e){reloadImage()}),innitFileUploadContactForm()}function innitFileUploadContactForm(){var e,t,a,n;(imputDocumentFile=document.getElementById("inputDetailFromFile"))&&(e=imputDocumentFile.dataset.curentPathFiles&&""!==imputDocumentFile.dataset.curentPathFiles?[imputDocumentFile.dataset.curentPathFiles]:null,t=imputDocumentFile.dataset.curentShowingImages&&""!==imputDocumentFile.dataset.curentShowingImages?[imputDocumentFile.dataset.curentShowingImages]:null,a=imputDocumentFile.dataset.maxFile&&""!==imputDocumentFile.dataset.maxFile?+imputDocumentFile.dataset.maxFile:3,n=imputDocumentFile.dataset.maxFile&&""!==imputDocumentFile.dataset.maxSize?+imputDocumentFile.dataset.maxSize:5,(fileUploadNewReview=new FileUpload).Init(null,e,t,"#inputDetailFromFile","#newReviewContainer","#newReviewContainer","#frmContact",a,console.log("change"),!0,"DetailFormFile",n))}function clearform(){$("#frmContact")[0].reset();var e=document.getElementById("newReviewContainer");e&&(e.innerHTML="")}function reloadImage(){var e=new Date;$("#img-captcha").attr("src","/get-captcha-image?"+e.getTime())}function loadSuggestProducts(){var e=document.querySelector("#formLazySuggestProduct #inputContainer");if(e&&LocalStorageHelper.Get(LocalStorageNamesEnum.UserCategoryList)){var t=LocalStorageHelper.Get(LocalStorageNamesEnum.UserCategoryList).sort(function(e,t){return 5*e.InOrderCount+3*e.CompleteCount+2*e.AddToCartCount+e.ViewCount>5*t.InOrderCount+3*t.CompleteCount+2*t.AddToCartCount+t.ViewCount?1:-1});t.length=Math.min(3,t.length);for(var a="",n=0;n<t.length;n++)a+='<input class="hide" type="text" name="CategoryLogModels['+n+'].CategoryId" value="'+t[n].CategoryId+'">'+('<input class="hide" type="number" name="CategoryLogModels['+n+'].ViewCount" value="'+t[n].ViewCount+'">')+('<input class="hide" type="number" name="CategoryLogModels['+n+'].AddToCartCount" value="'+t[n].AddToCartCount+'">')+('<input class="hide" type="number" name="CategoryLogModels['+n+'].InOrderCount" value="'+t[n].InOrderCount+'">')+('<input class="hide" type="number" name="CategoryLogModels['+n+'].CompleteCount" value="'+t[n].CompleteCount+'">');e.innerHTML=a,document.getElementById("btnReloadSuggestProduct").click()}}function loadUserViewedProduct(){var e=LocalStorageHelper.Get(LocalStorageNamesEnum.ViewProductClassificationIds),t=document.querySelector("#productViewedContainer");if(e&&e.length&&t){var a=e.length;t.dataset.itemCount&&(a=Math.min(a,t.dataset.itemCount));for(var n=0;n<a;n++){var o=e[n],r='<a href="[ProductUrl]" title="[ProductName]" class="_image-wrap -tablet-margin-bottom rounded-4 border-1 solid border-silver padding-5"> <img alt="[ProductName]" loading="lazy" class="r-lazy" src="[ProductThumnailUrl]"></a>';r=(r=(r=r.replace(/\[ProductUrl\]/g,o.ProductUrl)).replace(/\[ProductName\]/g,o.ProductName)).replace(/\[ProductThumnailUrl\]/g,o.ProductThumnailUrl),o=Site.HtmlToElement(r),t.appendChild(o[0])}}}function flashsaleCoutDown(e){var t=document.querySelector(e);if(t)for(var a=t.querySelectorAll("[data-flash-deal-count-down]"),n=0;n<a.length;n++){var o=Site.FindParent(a[n],"_p-product-widget");checkTimeCountDown(e+" [data-product-id='"+o.dataset.productId+"']")}}function loadProductSlider(e,t,a,n,o){new Swiper(e,{spaceBetween:5,slidesPerView:n,slidesPerColumn:o,navigation:{prevEl:t,nextEl:a}})}function loadDiscountCodeSliderForMobile(){Site.IsMobileBackend()&&new Swiper("._idDiscountCodeListContainer.swiper-container",{centeredSlides:!0,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}})}function initListVoucher(){for(var e=document.querySelectorAll("._idDiscountCodeListContainer [data-generate-barcode]"),t=0;t<e.length;t++)new QRCode(e[t],{text:e[t].dataset.generateBarcode,width:64,height:64,colorDark:"#000000",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.L});loadDiscountCodeSliderForMobile(),loadCountDown()}function loadCountDown(){var i=0;setInterval(function(){i-=1;for(var e=document.querySelectorAll("._idDiscountCodeListContainer [data-count-down]"),t=0;t<e.length;t++){if(!e)return;var a=e[t].dataset.countDown,n=Math.floor(a/86400),o=a%86400+i;if(-1==(o-=1))return void clearInterval(counter);var r=o%60,a=Math.floor(o/60),o=Math.floor(a/60);(a%=60)<10&&(a="0"+a),(o%=60)<10&&(o="0"+o),r<10&&(r="0"+r),e[t].innerHTML=(0<n?n+" ngày<br> ":"")+"<span count-down>"+o+":"+a+":"+r+"</span>"}},1e3)}function init(){btnLazyLoadProducts=document.querySelectorAll("form[data-selector-lazyload-products] [type='submit']")}function lazyloadCategoriesProduct(){for(var e=0;e<btnLazyLoadProducts.length;e++)btnLazyLoadProducts[e].click()}function loadSwipper(){new Swiper("[data-container-slider] .swiper-container",{spaceBetween:0,centeredSlides:!0,loop:!1,autoplay:{delay:3e3,disableOnInteraction:!0},navigation:{nextEl:"[data-container-slider] .swiper-button-next",prevEl:"[data-container-slider] .swiper-button-prev"},pagination:{el:"[data-container-slider] .swiper-pagination"}});var e=Site.IsMobileBackend()?2:5,e=(new Swiper(".swiper-container-partner-name",{spaceBetween:0,slidesPerView:e,centeredSlides:!1,loop:!1,autoplay:{delay:3e3,disableOnInteraction:!1},navigation:{nextEl:".swiper-button-next-brand",prevEl:".swiper-button-prev-brand"}}),Site.IsMobileBackend()?1:2);new Swiper(".swiper-container-review",{spaceBetween:0,slidesPerView:e,centeredSlides:!1,loop:!1,navigation:{prevEl:"[data-review] .swiper-button-prev",nextEl:"[data-review] .swiper-button-next"}})}function clearform(){$("#frmContact")[0].reset()}function reloadImage(){var e=new Date;$("#img-captcha").attr("src","/get-captcha-image?"+e.getTime())}document.addEventListener("DOMContentLoaded",function(){loadUserViewedProduct()}),document.addEventListener("DOMContentLoaded",function(){}),document.addEventListener("DOMContentLoaded",function(){init(),loadSwipper();new Rellax(".rellax");lazyloadCategoriesProduct()});