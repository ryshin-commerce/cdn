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
                spaceBetween: 5,
                centeredSlides: true,
                slidesPerView: 'auto',
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
            src: imagesmall[i].src || imagesmall[i].dataset.src,
            w: imagesmall[i].width,
            h: imagesmall[i].height,
            alt: imagesmall[i].alt,
            author: sliderEle.dataset.author
        }
        item.msrc = el.getAttribute('data-src') || el.getAttribute('src') ;
        item.el = el; // save link to element for getThumbBoundsFn
        item.title = sliderEle.dataset.seo;

        item.m = {
            src: images[i].src || imagesmall[i].dataset.src,
            w: images[i].width,
            alt: imagesmall[i].alt,
            h: images[i].height,
            author: sliderEle.dataset.author
        };

        item.o = {
            src: images[i].src || images[i].dataset.src ,
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

