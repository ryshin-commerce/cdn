"use strict";

/* * * * * * * * * * * * * * * * *
 * LocalStorageHelper
 * javascript page navigation
 * * * * * * * * * * * * * * * * */
function FileUpload() {
    this.InputElement = null;
    this.PreviewBoxElement = null;
    this.CurentImageBox = null;
    this.Form = null;
    this.MaxFile = null;
    this.StoredFiles = [];
    this.CurentFiles = [];
    this.CurentPreviewImages = [];
    this.Extend = function (hostCdn, arrayCurentFileNames, arrayCurentPreviewImages, inputElement, curentImageBox, previewBoxEle, form, maxfile, inputChangeCallback, isCreateInputName, uniqueControlName, maxFileSize) {
        var self = this;
        this.InputElement = inputElement;
        this.AcceptExtention = inputElement.accept.split(",");
        this.PreviewBoxElement = previewBoxEle;
        this.CurentImageBox = curentImageBox;
        this.Form = form;
        
        this.UniqueControlName = (!uniqueControlName ? "NewFiles" + uniqueControlName : "CurentFilePaths") ;
        this.MaxFile = maxfile || 2;
        this.MaxFileSize = maxFileSize || 5*1024*1024; 
        this.InputChangeCallBack = inputChangeCallback !== undefined ? inputChangeCallback : null;
        this.InputElement.addEventListener("change", this.InputChange);
        this.InputElement.fileUpload = this;
        this.FileReader = new FileReader();
        this.IsCreateInputName = isCreateInputName || false;
        this.HostCdn = hostCdn || "";
        this.CurentFiles = arrayCurentFileNames || [];
        this.CurentPreviewImages = arrayCurentPreviewImages || [];
        this.Process();
    };

    this.Process = function () {
        if (!this.CurentImageBox) {
            return;
        }
        var self = this;

        for (let i = 0; i < this.CurentFiles.length; i++) {
            var f = this.CurentFiles[i];
            var reviewf = this.CurentPreviewImages[i];
            var container = document.createElement("div");
            container.className = "col-3 gutter-10 _p-item";

            var figure = document.createElement('figure');
            figure.className = "_max-height-200 relative hover-children-show";
            var btn = document.createElement('button');

            btn.className = "absolute hide tablet-show -border width-100 height-100 _fill-silver-opacity text-strong";
            btn.innerText = "CLICK ĐỂ XÓA";
            btn.type = "button";
            btn.dataset.file = f;
            btn.dataset.notClose = "I";

            btn.addEventListener("click", function (evt) {
                //var parentContainer = Site.FindParent(evt.target, '_p-item');
                //parentContainer.remove();
                self.RemoveCurentFile(evt, self.InputElement);
            });

            var fileName = f.substring(f.lastIndexOf('/') + 1);
            var figureHtml;

            if (!f.type.match("image.*")) {
                figureHtml =
                    "<img class='_max-width-100-percent'   onerror='this.src=\"/images/shared/no-image.svg\"'   src='" +
                    self.HostCdn +
                    reviewf +
                    "' alt='" +
                    fileName +
                    "' data-file='" +
                    fileName +
                    "' /><figcaption class='padding-5 text-center _text-ellipsis'>" +
                    fileName +
                    "</figcaption>";
            } else {
                var fileExt = fileName.substring(fileName.indexOf('.') + 1);
                figureHtml = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' version='1'><path d='M128 0c-18 0-32 14-32 32v448c0 18 14 32 32 32h320c18 0 32-14 32-32V128L352 0H128z' fill='#e2e5e7'/><path d='M384 128h96L352 0v96c0 18 14 32 32 32z' fill='#b0b7bd'/><path fill='#cad1d8' d='M480 224l-96-96h96z'/><path d='M416 416c0 9-7 16-16 16H48c-9 0-16-7-16-16V256c0-9 7-16 16-16h352c9 0 16 7 16 16v160z' fill='#f15642'/><path d='M400 432H96v16h304c9 0 16-7 16-16v-16c0 9-7 16-16 16z' fill='#cad1d8'/><text y='375' x='212' style='line-height:1.25;text-align:center' font-weight='400' font-size='147' font-family='sans-serif' letter-spacing='0' word-spacing='0' text-anchor='middle' stroke-width='3'><tspan style='line-height:1.25;-inkscape-font-specification:'monospace Bold';text-align:center' y='375' x='212' font-weight='700' font-family='monospace' fill='#fff'>" + fileExt+"</tspan></text></svg>";
            }
            

            if (self.IsCreateInputName) {
                var input = "<input type='text' class='_hidden'    name='" + self.UniqueControlName + "' value=" + f + (!!self.Form ? " form='" + self.Form.id + "'" : "") + "></input>";
                figureHtml += input;
            }

            figure.innerHTML = figureHtml;
            figure.insertBefore(btn, figure.childNodes[0]);
            container.appendChild(figure);
            self.CurentImageBox.appendChild(container);
        }
    };
    this.InputChange = function (evt) {
        var self = evt.target.fileUpload;
        var files = evt.target.files;
        var filesArr = Array.prototype.slice.call(files);
        self.PreviewBoxElement.innerHTML = "";
        self.StoredFiles = [];

        for (var i = 0; i < filesArr.length; i++) {
            var f = filesArr[i];

            if (f.size > self.MaxFileSize) {
                Site.NotifyFormFailed("Lỗi", "File không được lớn hơn " + self.MaxFileSize / (1024 * 1024) + " mb");
                continue;
            }

            self.StoredFiles.push(f);

            if (self.PreviewBoxElement === self.CurentImageBox) {
                self.CurentFiles = [];
                self.CurentImageBox.innerHTML = "";
            }

            if (self.StoredFiles.length + self.CurentFiles.length <= self.MaxFile) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var fileReader = event.target;
                    var container = document.createElement("div");
                    container.className = "gutter-10 _p-item";

                    var figure = document.createElement('figure');
                    figure.className = "_max-height-200 relative hover-children-show";

                    var btn = document.createElement('button');
                    btn.className = "absolute hide -border width-100 height-100 _fill-silver-opacity text-strong";
                    btn.type = "button";
                    btn.innerText = "CLICK ĐỂ XÓA";
                    btn.dataset.file = fileReader.name;
                    btn.dataset.notClose = "I";

                    btn.addEventListener("click", function (evt) {
                        //var parentContainer = Site.FindParent(evt.target, '_p-item');
                        //parentContainer.remove();
                        self.RemoveFile(evt, self.InputElement);
                    });
                 
                    var figureHtml;

                    if (fileReader.fileType.match("image.*")) {
                        figureHtml = "<img class='width-100 _max-width-100-percent' src='" + e.target.result + "' alt='" + fileReader.name + "' data-file='" + fileReader.name + "' /><figcaption class='padding-5 text-center _text-ellipsis'>" + "(" + fileReader.size % 1000 + " kb) " + fileReader.name + "</figcaption>";
                    } else {
                        var fileExt = fileReader.name.substring(fileReader.name.indexOf('.') + 1);
                        figureHtml = "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 512 512' version='1'><path d='M128 0c-18 0-32 14-32 32v448c0 18 14 32 32 32h320c18 0 32-14 32-32V128L352 0H128z' fill='#e2e5e7'/><path d='M384 128h96L352 0v96c0 18 14 32 32 32z' fill='#b0b7bd'/><path fill='#cad1d8' d='M480 224l-96-96h96z'/><path d='M416 416c0 9-7 16-16 16H48c-9 0-16-7-16-16V256c0-9 7-16 16-16h352c9 0 16 7 16 16v160z' fill='#f15642'/><path d='M400 432H96v16h304c9 0 16-7 16-16v-16c0 9-7 16-16 16z' fill='#cad1d8'/><text y='375' x='212' style='line-height:1.25;text-align:center' font-weight='400' font-size='147' font-family='sans-serif' letter-spacing='0' word-spacing='0' text-anchor='middle' stroke-width='3'><tspan style='line-height:1.25;-inkscape-font-specification:'monospace Bold';text-align:center' y='375' x='212' font-weight='700' font-family='monospace' fill='#fff'>" + fileExt + "</tspan></text></svg>" + "<figcaption class='padding-5 text-center _text-ellipsis'>" + "(" + fileReader.size % 1000 + " kb) " + fileReader.name + "</figcaption>";
                    }

                    if (self.IsCreateInputName) {
                        var input = "<input type='text' class='_hidden' name='" + self.UniqueControlName + "[]' value=" + fileReader.name + (!!self.Form ? " form='" + self.Form.id + "'" : "") + "></input>";
                        figureHtml += input;
                    }

                    figure.innerHTML = figureHtml;
                    figure.insertBefore(btn, figure.childNodes[0]);
                    container.appendChild(figure);
                    self.PreviewBoxElement.appendChild(container);
                };
                reader.size = f.size;
                reader.fileType = f.type;
                reader.name = f.name;
                reader.readAsDataURL(f);
            }
        }
       
        if (!!self.InputChangeCallBack) {
            self.InputChangeCallBack(self.StoredFiles);
        }
    };
    this.RemoveCurentFile = function (evt) {
        var file = evt.target.dataset.file;
        for (var i = 0; i < this.CurentFiles.length; i++) {
            if (this.CurentFiles[i] === file) {
                this.CurentFiles.splice(i, 1);
                break;
            }
        }
        var parentContainer = Site.FindParent(evt.target, '_p-item');
        parentContainer.remove();
    };
    this.RemoveFile = function (evt, fuploadElement) {
        var file = evt.target.dataset.file;

        for (var i = 0; i < this.StoredFiles.length; i++) {
            if (this.StoredFiles[i].name === file) {
                this.StoredFiles.splice(i, 1);
                break;
            }
        }
        var parentContainer = Site.FindParent(evt.target, '_p-item');
        parentContainer.remove();

        //debugger;
        //this.InputElement.addEventListener("change", this.InputChange);
        Site.ClearInputFile(fuploadElement);
    };
    // init
    this.Init = function (hostCdn, arrayCurentFileNames, arrayCurentPreviewImages, inputSelector, curentImageBoxSelector, previewBoxSelector, formSelector, maxFileCount, inputChangeCallback, isCreateInputName, uniqueControlName, maxFileSize) {

        var inputEle = document.querySelector(inputSelector);
        var previewBox = document.querySelector(previewBoxSelector);
        var curentImageBox = document.querySelector(curentImageBoxSelector);
        var form = document.querySelector(formSelector);

        if (inputEle == null || previewBox == null) {
            console.warn(inputSelector + " or " + previewBox + ": NULL");
        }

        this.Extend(hostCdn, arrayCurentFileNames, arrayCurentPreviewImages, inputEle, curentImageBox, previewBox, form, maxFileCount, inputChangeCallback, isCreateInputName, uniqueControlName, maxFileSize);
    };
};
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
var galleryThumbs;
var galleryTop;

document.addEventListener("DOMContentLoaded",
    function (event) {

        LoadSwiperDefault();
        var btnShow = document.querySelector('._p-show-photowipe');
        btnShow.addEventListener("click",
            function (eve) {
                var index = galleryTop.activeIndex;
                _LoadImageSwipe(eve.target.dataset.selector, index);
            });

    });

function SlideToProductClass(productClassId) {
    var slideClassName = "swiper-slide-" + productClassId;

    for (var i = 1; i < galleryTop.slides.length; i++) {
        if (galleryTop.slides[i].classList.contains(slideClassName)) {
            galleryTop.slideTo(i);
            break;
        }
    }
}

function LoadSwiperDefault() {
    //TODO reload slider by productClass
    //var activeProductClasss = document.querySelector("[data-active-product-classification]");
    //var slideClassName = "swiper-slide-" + activeProductClasss.dataset.activeProductClassification;

    //var allSlides = document.querySelectorAll("[data-slide]");

    //for (var i = 0; i < allSlides.length; i++) {
    //    allSlides[i].classList.add("swiper-slide");
    //    allSlides[i].classList.remove("hide");
    //}

    //var excludeSlides = document.querySelectorAll(".swiper-slide:not(." + slideClassName + ")");
    //for (var i = 0; i < excludeSlides.length; i++) {
    //    excludeSlides[i].classList.remove("swiper-slide");
    //    excludeSlides[i].classList.add("hide");
    //}
    //TODO reload slider by productClass
    
    galleryTop = new Swiper('.gallery-top',
        {
            spaceBetween: 20,
            //autoplay: 20000,
            //speed: 400,
            preloadImages: true,
            centeredSlides: true,
            lazy: true,
            //loop: true
            pagination: '.swiper-pagination',
            paginationType: 'fraction',
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });

    galleryTop.update();

    if (!!document.querySelector(".gallery-thumbs")) {
        galleryThumbs = new Swiper('.gallery-thumbs',
            {
                spaceBetween: 20,
                centeredSlides: true,
                slidesPerView: 4,
                touchRatio: 0.2,
                slideToClickedSlide: true
            });

        if (galleryThumbs instanceof (Array)) {
            for (var i = 0; i < galleryThumbs.length; i++) {
                if (galleryThumbs[i].imagesToLoad.length > 0) {
                    galleryTop[i].controller.control = galleryThumbs;
                    galleryThumbs[i].controller.control = galleryTop;
                }
            }
        } else {
            galleryTop.controller.control = galleryThumbs;
            galleryThumbs.controller.control = galleryTop;
        }

        galleryThumbs.update();
    }

    //_LoadImageSwipe('._p-show-photowipe');
}

function _LoadImageSwipe(selector, index) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var sliderEle = document.querySelector(selector);
    var item, items = [];
    var images = document.querySelectorAll(selector + " .swiper-slide .hide");
    var imagesmall = document.querySelectorAll(selector + " .swiper-slide ._p-slide-image");

    var el = document.querySelector(selector + " .swiper-slide-active");

    if (!el) {
        console.warn("ko có thumb dùng top gallery");
    }

    for (var i = 0; i < images.length; i++) {

        item = {
            src: imagesmall[i].dataset.src || imagesmall[i].src,
            w: imagesmall[i].width,
            h: imagesmall[i].height,
            alt: imagesmall[i].alt,
            author: sliderEle.dataset.author
        }
        item.msrc = el.getAttribute('data-src') || el.getAttribute('src') ;
        item.el = el; // save link to element for getThumbBoundsFn
        item.title = sliderEle.dataset.seo;

        item.m = {
            src: imagesmall[i].dataset.src || images[i].src,
            w: images[i].width,
            alt: imagesmall[i].alt,
            h: images[i].height,
            author: sliderEle.dataset.author
        };

        item.o = {
            src: images[i].dataset.src || images[i].src,
            w: images[i].width,
            alt: imagesmall[i].alt,
            h: images[i].height,
            author: sliderEle.dataset.author
        };

        items.push(item);
    }



    // define options (if needed)
    var options = {
        // history & focus options are disabled on CodePen     
        index: index,
        history: false,
        focus: false,
        //showAnimationDuration: 0,
        hideAnimationDuration: 0,
        getThumbBoundsFn: function (index) {
            // See Options->getThumbBoundsFn section of docs for more info
            var thumbnail = items[index].el.children[0],
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect();

            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        },
        galleryUID: selector
    };

    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

    var realViewportWidth,
        useLargeImages = false,
        firstResize = true,
        imageSrcWillChange;
    
    gallery.listen('beforeResize', function () {

        var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
        dpiRatio = Math.min(dpiRatio, 2.5);
        realViewportWidth = gallery.viewportSize.x * dpiRatio;


        if (realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
            if (!useLargeImages) {
                useLargeImages = true;
                imageSrcWillChange = true;
                console.log(screen.width + "use largeImage");
            }

        } else {
            if (useLargeImages) {
                useLargeImages = false;
                imageSrcWillChange = true;
                console.log(screen.width + "not use largeImage");
            }
        }

        if (imageSrcWillChange && !firstResize) {
            gallery.invalidateCurrItems();
        }

        if (firstResize) {
            firstResize = false;
        }

        imageSrcWillChange = false;

    });

    gallery.listen('gettingData', function (index, item) {
        if (useLargeImages) {
            item.src = item.o.src;
            item.alt = item.o.alt;
            item.w = item.o.w;
            item.h = item.o.h;
        } else {
            item.src = item.m.src;
            item.alt = item.o.alt;
            item.w = item.m.w;
            item.h = item.m.h;
        }
    });

    gallery.init();
}


/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

function Quantity() {
    // converting initialize data
    this.Extend = function (downElement, upElement, targetElement, valueChangeCallBack) {
        this.DownElement = downElement;
        this.UpElement = upElement;
        this.TargetElement = targetElement;
        this.ValueChangeCallBack = valueChangeCallBack || function() {console.log("ValueChange don't have callback")};
        this.Process();
    };

    this.Process = function () {
        var self = this;
        this.UpElement.addEventListener("click", function(eve) {
            if (+self.TargetElement.value < +self.TargetElement.max) {
                self.TargetElement.value = ++self.TargetElement.value;

                if (!!self.ValueChangeCallBack) {
                    self.ValueChangeCallBack();
                }
            }
        });
        this.DownElement.addEventListener("click", function (eve) {
            if (+self.TargetElement.value > +self.TargetElement.min) {
                self.TargetElement.value = --self.TargetElement.value;

                if (!!self.ValueChangeCallBack) {
                    self.ValueChangeCallBack();
                }
            }
        });
        this.TargetElement.addEventListener("keyup", function (eve) {
            if (+self.TargetElement.value > +self.TargetElement.max) {
                self.TargetElement.value = +self.TargetElement.max;
            }
            else if (+self.TargetElement.value < +self.TargetElement.min) {
                self.TargetElement.value = +self.TargetElement.min;
            }

            if (!!self.ValueChangeCallBack) {
                self.ValueChangeCallBack();
            }
        });

        this.TargetElement.addEventListener("change", function (eve) {
            if (!!self.ValueChangeCallBack) {
                self.ValueChangeCallBack();
            }
        });

      
    };

    // init
    this.Init = function (containerElement, valueChangeCallBack) {
        var downElement = containerElement.querySelector("[data-minus]");
        var upElement = containerElement.querySelector("[data-plus]");
        var targetElement = containerElement.querySelector("input[type='number']");
        this.Extend(downElement, upElement, targetElement, valueChangeCallBack);
    }
};



"use strict";

var listQuantities, chkOutOfStock, txtQuantity, attribute1Items, attribute2Items, productClassificationId, dataPrice, newestPostsContainer;
var activeProductClass;
var subscribeButton, discountPercentEle;
var flashSaleContainer, dataCountEle, dataProcessBarEle, dataDelPrice;
var isFistLoad = true;
var didScroll = false, listSections, dataHead, isClick = false;

document.addEventListener("DOMContentLoaded",
    function () {
        init();
        Site.LockOnsCroll = false;
        var i;

        for (i = 0; i < listQuantities.length; i++) {
            const quantity = new Quantity();
            quantity.Init(listQuantities[i], reloadMoneyAndQuantity);
        }
        for (i = 0; i < attribute1Items.length; i++) {
            attribute1Items[i].addEventListener("change", reloadMoneyAndQuantity);
        }
        for (i = 0; i < attribute2Items.length; i++) {
            attribute2Items[i].addEventListener("change", reloadMoneyAndQuantity);
        }

        reloadMoneyAndQuantity();
        loadJqueryZoom();
        try {
            JsBarcode("._barcode").init();
        } catch (e) {
            console.log(e);
        }

        load360Spin();
        atiCopyRight();
        //subscribeButton = document.getElementById('btnSubscribe');

        //if (!!subscribeButton) {
        //    subscribeButton.addEventListener('click',
        //        function () {
        //            PushNotifications.subscribeForPushNotifications(subscribeCallBack);
        //        });
        //}
        PushNotifications.initialize();
        submitProductWidgetAction("[data-related-products]");
        loadScrollNav();
        LocalStorageHelper.LogCategory(productCategoryId, true, false, false, false);
        const thumnailSrc = document.querySelector("[data-first-thumnail]").dataset.firstThumnail;
        LocalStorageHelper.LogProductClassIdView(activeProductClass.dataset.activeProductClassification, document.querySelector('[name=ProductName]').value, thumnailSrc, document.querySelector("link[rel='canonical']").href);
        processAnonymousUser();
        innitFileUpload();
        document.getElementById("btnReloadRatings").click();
    });



function innitFileUpload() {
    //----------------
    //----------------
    var imputDocumentFile = document.getElementById("inputRatingFormFile");

    const curentImageContactFilePath = !!imputDocumentFile.dataset.curentPathFiles && imputDocumentFile.dataset.curentPathFiles !== ""
        ? [imputDocumentFile.dataset.curentPathFiles]
        : null;

    const curentImageContactBackgroundUrl =
        !!imputDocumentFile.dataset.curentShowingImages && imputDocumentFile.dataset.curentShowingImages !== ""
            ? [imputDocumentFile.dataset.curentShowingImages]
            : null;

    //
    const dataMaxFile = !!imputDocumentFile.dataset.maxFile && imputDocumentFile.dataset.maxFile !== ""
        ? +imputDocumentFile.dataset.maxFile
        : 3;
    const dataMaxSize = !!imputDocumentFile.dataset.maxFile && imputDocumentFile.dataset.maxSize !== ""
        ? +imputDocumentFile.dataset.maxSize
        : 5;
    //

    var fileUploadNewReview = new FileUpload();
    fileUploadNewReview.Init(null,
        curentImageContactFilePath,
        curentImageContactBackgroundUrl,
        "#inputRatingFormFile",//file
        "#newReviewContainer",//review showing
        "#newReviewContainer",//new showing
        "#frmProductRating",
        dataMaxFile,
        console.log("change"),
        true,
        "RatingFormFile", dataMaxSize);//unique name
}

//contact
function clearform() {
    $('#frmProductRating')[0].reset();
    var imageReverContainer = document.getElementById("newReviewContainer");

    if (!!imageReverContainer) {
        imageReverContainer.innerHTML = "";
    }
}

function loadScrollNav() {
    var btnNavs = document.querySelectorAll("[data-nav-product-detail] button");
    for (var i = 0; i < btnNavs.length; i++) {
        btnNavs[i].addEventListener("click",
            function (eve) {
                //Site.LockOnsCroll = true;
                Site.ScrollToElement("[data-section='" + eve.currentTarget.dataset.target + "']");
                //setTimeout(function () {
                //    //Site.LockOnsCroll = false;
                //    document.querySelector("[data-head]").classList.remove("_zDocActive");
                //}, 3000);
            });
    }

    //window.onscroll = function () {
    //    if (!Site.LockOnsCroll) {
    //        updateZDocActive();
    //    }
    //};
}

function processFancybox() {
    debugger;
    //$("a._z-fancyBox").fancybox();
}

function processAnonymousUser() {
    var canvases = document.querySelectorAll("._id-listRatings canvas");

    for (var i = 0; i < canvases.length; i++) {
        var canvas = canvases[i];

        var name = canvas.dataset.userName,
            nameSplit = name.split(" "),
            initials = nameSplit.length > 2 ? nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase() : nameSplit[0].charAt(0).toUpperCase();

      
        var context = canvas.getContext("2d");

        var canvasCssWidth = canvas.width,
            canvasCssHeight = canvas.height;

        if (window.devicePixelRatio) {
            canvas.setAttribute("width", canvasCssWidth * window.devicePixelRatio);
            canvas.setAttribute("height", canvasCssHeight * window.devicePixelRatio);
            canvas.style.width= canvasCssWidth+"px";
            canvas.style.height = canvasCssHeight + "px";
            context.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        context.fillStyle = stringToHslColor(initials,30,80);
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = (canvasCssHeight/2)+ "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);
    }
}

function stringToHslColor(str, s, l) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

var zDockInterval = setInterval(function () {

    var sectionActive = 1;
    for (var i = 0; i < listSections.length; i++) {
        if (!listSections[i]) {
            continue;
        }

        if (listSections[i].getBoundingClientRect().y < 5) {
            sectionActive = listSections[i].dataset.section;
        }
    }
    dataHead.dataset.sessionActive = sectionActive;

}, 100);



//
function loadFlashSaleSwiper() {
    Site.bLazy.load(document.querySelectorAll(".swiper-flashsale-container img", true), false);

    var isMobile = document.querySelector("[data-device=Mobile]");
    var isDesktop = document.querySelector("[data-device=Desktop]");
    var slidesPerView = 4;

    if (isMobile) {
        slidesPerView = 2;
    }
    else if (!isDesktop) {
        slidesPerView = 3;
    }


    var flashSales = new Swiper('.swiper-flashsale-container',
        {
            slidesPerView: slidesPerView,
            spaceBetween: -1,
            slidesPerGroup: slidesPerView,
            loop: false,
            loopFillGroupWithBlank: true,
            //pagination: {
            //    el: '.swiper-pagination',
            //    clickable: true,
            //},
            lazy: {
                loadPrevNext: true
            },
            preloadImages: false,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
}

function atiCopyRight() {
    var itemListElement = document.querySelector("[itemprop='itemListElement']:last-child");
    var text = itemListElement.innerText;
    var url = itemListElement.querySelector("[content]").attributes["content"].value;

    var fakaH3Tag = document.createElement("h3");
    fakaH3Tag.classList = "d-none";

    var atag = document.createElement("a");
    atag.innerText ="Nguồn: "+ text + " tại " + window.location.hostname + "";
    atag.href = url;
    atag.alt = "Chi tiết sản phẩm " + text + " tại " + window.location.hostname + ". ";
    atag.classList = "_atyc";
    atag.setAttribute("style", "display:block !important;font-size:0 !important;height:0; color:transparent !important;  ");

    fakaH3Tag.appendChild(atag);
    fakaH3Tag.setAttribute("style", "display:block !important;font-size:0 !important;height:0; color:transparent !important;  ");

    var container = document.querySelector("[data-html-content]");
    container.insertBefore(fakaH3Tag, container.querySelector("h3 ~ p"));
}


function init() {
    activeProductClass = document.querySelector("[data-active-product-classification]");
    listQuantities = document.querySelectorAll("._quantity");
    chkOutOfStock = document.querySelector("[data-out-of-stock]");
    txtQuantity = document.querySelector("[data-quantity]");
    attribute1Items = document.querySelectorAll('input[name="Attribute1Value"]');
    attribute2Items = document.querySelectorAll('input[name="Attribute2Value"]');
    productClassificationId = document.querySelector("[name=ProductClassificationId]");
    dataPrice = document.querySelector("[data-price]");
    dataDelPrice = document.querySelector("[data-del-price]");

    discountPercentEle = document.querySelector("[data-css-discount]");
    newestPostsContainer = document.querySelector("[data-selector-newest-post]");
    flashSaleContainer = document.querySelector("[data-flash-sale-detail]");
    dataCountEle = flashSaleContainer.querySelector("[data-count]");
    dataProcessBarEle = flashSaleContainer.querySelector("progress");

    listSections = [
        document.querySelector("[data-section='1']"),
        document.querySelector("[data-section='2']"),
        document.querySelector("[data-section='3']"),
        document.querySelector("[data-section='4']"),
        document.querySelector("[data-section='5']"),
        document.querySelector("[data-section='6']"),
        document.querySelector("[data-section='7']")
    ];
    dataHead = document.querySelector("main");
};


function reloadMoneyAndQuantity() {
    var attributeValue1 = !!document.querySelector('input[name="Attribute1Value"]:checked') ? document.querySelector('input[name="Attribute1Value"]:checked').value : "";
    var attributeValue2 = !!document.querySelector('input[name="Attribute2Value"]:checked') ? document.querySelector('input[name="Attribute2Value"]:checked').value : "";

    var selectedQuantityInfo = listPriceInfo.filter(function (item) {
        return item.attribute1Value === attributeValue1 && item.attribute2Value === attributeValue2;
    });
    //TODO reload slider by productClass
    activeProductClass.dataset.activeProductClassification = selectedQuantityInfo[0].productClassificationId;



    LoadSwiperDefault();
    if (isFistLoad) {
        isFistLoad = false;
    } else {
        SlideToProductClass(selectedQuantityInfo[0].productClassificationId);
    }

    //TODO reload slider by productClass
    if (selectedQuantityInfo.length === 0) {
        chkOutOfStock.checked = true;
        return;
    };

    history.replaceState(null, null, selectedQuantityInfo[0].url);
    //location.replace(selectedQuantityInfo[0].url);

    var quantity = selectedQuantityInfo[0].quantity;

    productClassificationId.value = selectedQuantityInfo[0].productClassificationId;
    chkOutOfStock.checked = quantity <= 0;
    txtQuantity.max = quantity;

    if (+txtQuantity.value > +txtQuantity.max) {
        txtQuantity.value = +txtQuantity.max;
    }
    //
    var selectedClassItem = listPriceInfo.filter(function (item) {
        return item.attribute1Value === attributeValue1 && item.attribute2Value === attributeValue2;
    })[0];

    var quantitiesPrices = selectedClassItem.quantitiesPrice;

    var priceUnit = quantitiesPrices[quantitiesPrices.length - 1].money;
    for (let i = quantitiesPrices.length - 1; i >= 0; i--) {

        if (quantitiesPrices[i].range !== 0 && +txtQuantity.value >= quantitiesPrices[i].range) {
            break;
        }

        priceUnit = quantitiesPrices[i].money;
    }

    dataPrice.innerHTML = WNumbHelper.GetFrNumber(priceUnit) + "<sup>đ</sup>";
    dataPrice.dataset.price = priceUnit;
    dataPrice.style.visibility = "visible";

    dataDelPrice.classList.add("hide");
    if (priceUnit < (+dataDelPrice.dataset.delPrice)) {
        dataDelPrice.classList.remove("hide");
    }

    discountPercentEle.classList.add("hide");
    var discountPercent = 100 - priceUnit * 100 / selectedClassItem.price;

    if (discountPercent > 0) {
        discountPercentEle.classList.remove("hide");
        discountPercentEle.innerText = (selectedClassItem.isFlashSale ? "Flash Sale -" : "Giảm ") + Number(discountPercent).toFixed(2) + "%";
    }

    dataCountEle.removeAttribute("data-flash-deal-count-down");
    dataProcessBarEle.removeAttribute("data-is-host");
    flashSaleContainer.classList.add("hide");

    if (selectedClassItem.isFlashSale) {
        flashSaleContainer.classList.remove("hide");

        if (selectedClassItem.valueQuantity <= 0) {
            dataCountEle.dataset.flashDealCountDown = selectedClassItem.countDownTime;
            checkTimeCountDown("[data-css-simple-detail]");
        }
        else {
            dataCountEle.innerText = "còn " + selectedClassItem.countDownQuantity + " sản phẩm";
        }

        if (selectedClassItem.valueQuantity * selectedClassItem.maxHours > selectedClassItem.hours * selectedClassItem.maxValueQuantity)//valueQuantity  / maxValueQuantity > hours / maxHours
        {
            debugger;
            dataProcessBarEle.setAttribute("data-is-hot", "true");
            dataProcessBarEle.max = selectedClassItem.maxValueQuantity;
            dataProcessBarEle.value = selectedClassItem.valueQuantity;
        }
        else {
            dataProcessBarEle.removeAttribute("data-is-hot");
            dataProcessBarEle.max = selectedClassItem.maxHours;
            dataProcessBarEle.value = selectedClassItem.hours;
        }

    }
    //const rowItems = document.querySelectorAll("[data-class-id]");
    //var summaryMoney = 0;
    //for (let i = 0; i < rowItems.length;i++) {
    //    const unitPrice = +rowItems[i].querySelector("[data-unit-price]").dataset.unitPrice;
    //    const quantity = +rowItems[i].querySelector("[data-quantity]").value;
    //    const itemPrice = rowItems[i].querySelector("[data-item-price]");
    //    const itemMoney = unitPrice * quantity;
    //    summaryMoney += itemMoney;
    //    itemPrice.innerHTML = WNumbHelper.GetFrNumber(itemMoney);
    //}
    //const summaryItem = document.querySelector("[data-summary]");
    //summaryItem.innerHTML = WNumbHelper.GetFrNumber(summaryMoney);

    var frmAddToCart = document.querySelector("#frmAddToCart");

    if (!!frmAddToCart) {
        var productId = frmAddToCart.querySelectorAll('[name=ProductClassificationId]')[1].value ||
            frmAddToCart.querySelectorAll('[name=ProductClassificationId]')[0].value;
        var productClassSelected = document.querySelector('[data-css-simple-detail] [type=radio]:checked');
        var productClassName = productClassSelected != null ? productClassSelected.value : "";
        var productName = document.querySelector('[name=ProductName]').value;
        EnhancedEcommerce.AddImpression(productId, productName, productClassName);
    }

}
function updateAnalytic() {
    var frmAddToCart = document.querySelector("#frmAddToCart");

    if (!!frmAddToCart) {
        var productId = frmAddToCart.querySelectorAll('[name=ProductClassificationId]')[1].value ||
            frmAddToCart.querySelectorAll('[name=ProductClassificationId]')[0].value;
        var productClassSelected = document.querySelector('[data-css-simple-detail] [type=radio]:checked');
        var productClassName = productClassSelected != null ? productClassSelected.value : "";
        var productName = document.querySelector('[name=ProductName]').value;
        var price = document.querySelector('[data-css-simple-detail] [data-price]').dataset.price;
        EnhancedEcommerce.AddProduct(productId, productName, productClassName, '', '', price);
    }

}

function btnByNowClick(eve) {
    window.location = eve.target.dataset.href;
}

function load360Spin() {
    var spritespin = document.querySelector('.spritespin');
    if (spritespin) {
        if (!!spritespin.dataset.width) {
            $('.spritespin').spritespin({
                source: image360Sources,
                width: Math.min(document.querySelector('#spin360').getBoundingClientRect().width, 500),
                height: Math.min(document.querySelector('#spin360').getBoundingClientRect().width, 500),               
                // reverse interaction direction
                sense: -1,
                frameTime: 100,
                responsive: false
            });
        } else {
            $('.spritespin').spritespin({
                source: image360Sources,
                width: 500,
                height: 500,
                // reverse interaction direction
                sense: -1,
                frameTime: 100,
                responsive: true
            });
        }

    }
}

function ratingCompleteCallBack() {
    console.log("Reload ratings");

    document.querySelector("#ratingSection details").removeAttribute("open");
}

function loadJqueryZoom() {
    var isDesktop = document.querySelector("[data-device=Desktop]");
    if (!!isDesktop) {
        var imageThumnails = document.querySelectorAll('[data-zoom]');

        for (var i = 0; i < imageThumnails.length; i++) {
            new Drift(imageThumnails[i], {
                paneContainer: document.querySelector("[data-css-simple-detail]")
            });
        }
    }
}



//# sourceMappingURL=product-detail.bundle.js.map
