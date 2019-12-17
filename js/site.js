"use strict";

/* * * * * * * * * * * * * * * * *
 * Site
 * javascript page navigation
 * var test; // false
var test2 = null; // false
var test3 = 'undefined'; // false
var test4 = 'true'; // true
var test5 = 'false'; // false
var test6 = true; // true
var test7 = false; // false
var test8 = 1; // true
var test9 = 0; // false
var test10 = '1'; // true
var test11 = '0'; // false
 * * * * * * * * * * * * * * * * */
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;

    if (!e.preventDefault)
        e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

var WNumbHelper = {
    Init: function Init() {
        WNumbHelper.defaultNumberFormat = wNumb({
            decimals: 0,
            thousand: "."
        });
        WNumbHelper.defaultDoubleFormat = wNumb({
            decimals: 2,
            thousand: "."
        });
        WNumbHelper.longNumberFormatShort = wNumb({
            decimals: 0,
            edit: function edit(number) {
                if (Math.round(number) === 0) {
                    return "0";
                }
                var money;
                var subfix;

                if (number >= 1000000000) {
                    money = number / 1000000000;
                    subfix = "B";
                } else if (number >= 1000000) {
                    money = number / 1000000;
                    subfix = "M";
                } else if (number >= 1000) {
                    money = number / 1000;
                    subfix = "K";
                } else {
                    money = number;
                    subfix = "";
                }

                return Math.round(money) +  subfix;
            }
        });
        WNumbHelper.moneyFormatShort = wNumb({
            decimals: 0,
            edit: function edit(number) {
                if (Math.round(number) === 0) {
                    return "$--";
                }
                var money;
                var subfix;

                if (number >= 1000000000) {
                    money = number / 1000000000;
                    subfix = "T";
                } else if (number >= 1000000) {
                    money = number / 1000000;
                    subfix = "tr";
                } else if (number >= 1000) {
                    money = number / 1000;
                    subfix = "k";
                } else {
                    return "$--";
                }

                return "$" + Math.round(money * 100) / 100 + " " + subfix;
            }
        });
        WNumbHelper.moneyFormat = wNumb({
            decimals: 0,
            edit: function edit(number) {
                if (Math.round(number) === 0) {
                    return "$--";
                }
                var money;
                var subfix;

                if (number >= 1000000000) {
                    money = number / 1000000000;
                    subfix = "tỷ";
                } else if (number >= 1000000) {
                    money = number / 1000000;
                    subfix = "triệu";
                } else if (number >= 1000) {
                    money = number / 1000;
                    subfix = "ngàn";
                } else {
                    return "$--";
                }

                return "$" + Math.round(money * 100) / 100 + " " + subfix;
            }
        });
    },

    GetFrNumber: function GetFrNumber(num) {
        return WNumbHelper.defaultNumberFormat.to(num);
    },
    GetSizem: function GetSizem(num) {
        return (
            WNumbHelper.defaultNumberFormat.to(num) +
            " m<sup class='_text-xx-sm'>2</sup>"
        );
    },
    GetPrice: function GetPrice(number) {
        var isShort =
            arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (Math.round(number) === 0) {
            return "";
        } else {
            return isShort
                ? WNumbHelper.moneyFormatShort.to(+number)
                : WNumbHelper.moneyFormat.to(+number);
        }
    },
    GetPricePerm: function GetPricePerm(price, landZise) {
        if (
            price == null ||
            Math.round(price) === 0 ||
            landZise == null ||
            Math.round(price) === 0
        ) {
            return "";
        } else {
            return WNumbHelper.moneyFormat.to(+price / landZise) + "/m<sup>2</sup>";
        }
    }
};


var Site = {
    LockOnsCroll: false,
    SetLockOnScroll: function (second = 1) {
        Site.LockOnsCroll = true;

        setTimeout(function () {
            Site.LockOnsCroll = false;
        }, second*1000);
    },
    // --------------------
    // Utility
    // --------------------
    IsMobile: function IsMobile() {
        var a = navigator.userAgent || navigator.vendor || window.opera;
        return (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        );
    },
    IsMobileBackend: function () {
        return document.body.dataset.device === "Mobile";
    },
    IsDesktopBackend: function () {
        return document.body.dataset.device === "Desktop";
    },
    CreateEvent: function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail
        );
        return evt;
    },
    GetFunction: function (code, argNames) {
        var fn = window, parts = (code || "").split(".");
        while (fn && parts.length) {
            fn = fn[parts.shift()];
        }
        if (typeof (fn) === "function") {
            return fn;
        }
        argNames.push(code);
        return Function.constructor.apply(null, argNames);
    },
    RemoveDefaultNumberInputField: function (selector) {
        var element = document.querySelector(selector) || document;
        var elements = element.querySelectorAll("[value='0']");
        for (var i = 0; i < elements.length; i++) {
            elements[i].value = "";
        }

    },
    Notify: function Notify(
        title,
        text,
        hide,
        type,
        promptDefault,
        buttonCloser
    ) {
        //"notice", "info", "success", or "error".
        var stack = {
            dir1: "up",
            dir2: "left",
            push: "bottom",
            spacing1: 25,
            spacing2: 25,
            context: $("body"),
            modal: false
        };

        var opts = {
            stack: stack,
            title: title,
            text: text,
            hide: hide !== undefined ? hide : true,
            type: type,
            addclass: "stack-bottomright",
            buttons: {
                closer_hover: buttonCloser,
                sticker: false
            },
            confirm: {
                prompt: true,
                prompt_multi_line: true,
                prompt_default: promptDefault
            }
        };

        if (promptDefault) {
            opts.confirm = {
                prompt: true,
                prompt_multi_line: true,
                prompt_default: promptDefault
            };
        }

        new PNotify(opts);
    },
    NotifyFormFailed: function NotifyFormFailed(title, text) {
        Site.Notify(title, text, false, "error", null, true);
    },
    NotifyFormSuccess: function NotifyFormSuccess(title, text) {
        Site.Notify(title, text, true, "success", null, true);
    },
    LoadJsonResult: function LoadJsonResult(data, textStatus, jqXhr) {
        if (textStatus === "success") {
            Site.Notify(
                data.title,
                data.text,
                data.hide,
                data.type,
                data.promptDefault,
                data.buttonCloser
            );
            if (data.jsAction) {
                var f = new Function(data.jsAction);
                return f();
            }
        } else {
            new PNotify({
                title: "CẢNH BÁO!",
                text: "Gửi dữ liệu tới server thất bại",
                type: "error"
            });
        }
    },
    ConsumeAlert: function ConsumeAlert() {
        window.alert = function (message) {
            new PNotify({
                title: "Alert",
                text: message
            });
        };
    },
    ClosePopup() {
        var models = document.querySelectorAll("._modal");

        for (var j = 0; j < models.length; j++) {
            models[j].click();
        }

    },
    InnitPopup: function InnitPopup(eleSelector) {
        var btnModels = !eleSelector ? document.querySelectorAll("[data-target-model]") : document.querySelectorAll(eleSelector);
        for (var i = 0; i < btnModels.length; i++) {
            if (btnModels[i].hasAttribute("disabled")) {
                continue;
            }

            btnModels[i].addEventListener("click", function (eve) {
                var popupModel = document.querySelector(this.dataset.targetModel);
                popupModel.classList.remove("hidden");
                popupModel.classList.add("visible");
                var f = new Function(popupModel.dataset.modelShowCallback);
                if (!!f) {
                    f();
                }
                //document.getElementsByTagName("body")[0].style.overflow = "hidden";
                document.getElementsByTagName("body")[0].classList.add("_model-show");
                //click itsafe
                if (!popupModel.classList.contains("_scroll-hide")) {
                    Site.DisableScroll();
                }
            });
        }

        var models = document.querySelectorAll("._modal");

        for (var j = 0; j < models.length; j++) {
         
            models[j].addEventListener("click", function (modelEve) {
                if (!!modelEve.target.parentElement && !modelEve.target.hasAttribute("data-not-close") &&
                    (!Site.FindParent(modelEve.target, "_modal-content") ||
                        !!modelEve.target.hasAttribute("data-type-close-popup"))
                ) {

                    this.classList.remove("visible");
                    this.classList.add("hidden");
                    document.getElementsByTagName("body")[0].style.overflow = "initial";
                    document.getElementsByTagName("body")[0].classList.remove("_model-show");
                    Site.EnableScroll();
                    //document.getElementsByTagName("body")[0].removeAttribute("scroll");
                }
            });
        }

        var modelsScrollHide = document.querySelectorAll("._modal._scroll-hide");

        if (modelsScrollHide.length > 0) {
            window.onscroll = function () {
                for (var i = 0; i < modelsScrollHide.length; i++) {
                    modelsScrollHide[i].dispatchEvent(new Site.CreateEvent("click"));
                }
            };
        }
    },
    ScrollToElement(selector) {
        Site.SetLockOnScroll(3);

        var element = document.querySelector(selector);

        if (!element)
            return;

        document.querySelector(selector).scrollIntoView({
            behavior: 'smooth'
        });
    },
    AppendScript: function AppendScript(dataSlug, url, callback) {
        var scripts = document.querySelectorAll(
            "script[data-slug='" + dataSlug + "']"
        );
        if (scripts.length > 0) {
            callback();
            return;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.dataset.slug = dataSlug;

        if (script.readyState) {
            //IE
            script.onreadystatechange = function () {
                if (
                    script.readyState === "loaded" ||
                    script.readyState === "complete"
                ) {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    AppendStyle: function AppendStyle(dataSlug, url, callback) {
        var styles = document.querySelectorAll(
            "script[data-slug='" + dataSlug + "']"
        );

        if (styles.length > 0) {
            if (!!callback) {
                callback();
            }
            return;
        }

        var style = document.createElement("link");
        style.type = "text/css";
        style.rel = "Stylesheet";
        style.dataset.slug = dataSlug;

        if (style.readyState) {
            //IE
            style.onreadystatechange = function () {
                if (style.readyState === "loaded" || style.readyState === "complete") {
                    style.onreadystatechange = null;
                    if (!!callback) {
                        callback();
                    }
                }
            };
        } else {
            //Others
            style.onload = function () {
                if (!!callback) {
                    callback();
                }
            };
        }
    },
    ClearInputFile: function ClearInputFile(f) {
        if (f.value) {
            try {
                f.value = ""; //for IE11, latest Chrome/Firefox/Opera...
            } catch (err) { }
            if (f.value) {
                //for IE5 ~ IE10
                var ref = f.nextSibling;
                ref.parentNode.insertBefore(f, ref);
            }
        }
    },
    GetGeoLocation: function GetGeoLocation(successCallback, errorCallback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            NotifyFormFailed(
                "THÔNG BÁO",
                "Geolocation is not supported by this browser."
            );
        }
    },
    GetBrowserName: function GetBrowserName() {
        // Firefox 1.0+
        if (typeof InstallTrigger !== "undefined") {
            return "Firefox";
        }

        // Chrome 1+
        if (!!window.chrome && !!window.chrome.webstore) {
            return "Chrome";
        }

        // Safari 3.0+ "[object HTMLElementConstructor]"
        if (
            /constructor/i.test(window.HTMLElement) ||
            (function (p) {
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window["safari"] || safari.pushNotification)
        ) {
            return "Safari";
        }

        // Opera 8.0+
        if (
            (!!window.opr && !!opr.addons) ||
            !!window.opera ||
            navigator.userAgent.indexOf(" OPR/") >= 0
        ) {
            return "Opera";
        }

        // Internet Explorer 6-11
        if (/*@cc_on!@*/ false || !!document.documentMode) {
            return "InternetExplorer";
        }

        // Edge 20+
        if (!isIE && !!window.StyleMedia) {
            return "Edge";
        }

        return "Blink";

        // Blink engine detection
    },
    InnitAutoHide: function InnitAutoHide() {
        var elements = document.querySelectorAll("[data-auto-hide]._auto-active");
        for (var i = 0; i < elements.length; i++) {
            var ele = elements[i];
            setTimeout(
                function (ele) {
                    ele.classList.add("hide");
                    ele.classList.remove("show");

                    if (ele.dataset.callbackEvent) {
                        var f = new Function(ele.dataset.callbackEvent);
                        return f();
                    }
                },
                ele.dataset.time || 3000,
                ele
            );
        }
    },
    InnitAutoShow: function InnitAutoShow() {
        var elements = document.querySelectorAll("[data-auto-show]._auto-active");
        for (var i = 0; i < elements.length; i++) {
            var ele = elements[i];
            setTimeout(
                function (ele) {
                    ele.classList.remove("hide");
                    ele.classList.add("show");

                    if (ele.dataset.callbackEvent) {
                        var f = new Function(ele.dataset.callbackEvent);
                        return f();
                    }
                },
                ele.dataset.time || 3000,
                ele
            );
        }
    },

    DisableScroll: function DisableScroll() {
        if (window.addEventListener)
            // older FF
            window.addEventListener("DOMMouseScroll", preventDefault, false);
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove = preventDefault; // mobile
        document.onkeydown = preventDefaultForScrollKeys;
    },
    EnableScroll: function EnableScroll() {
        if (window.removeEventListener)
            window.removeEventListener("DOMMouseScroll", preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    },
    FindParent: function FindParent(ele, className) {
        var parent = ele;

        while (parent !== null && !parent.classList.contains(className)) {
            parent = parent.parentElement;
        }
        return parent;
    },
    FindParentByAttribute: function FindParentByAttribute(ele, attributeName) {
        var parent = ele;

        while (parent !== null && !parent.hasAttribute(attributeName)) {
            parent = parent.parentElement;
        }
        return parent;
    },
    FindParentByInputType: function FindParentByInputType(ele, inputTypeName) {
        var parent = ele;

        while (parent !== null && parent.type !== inputTypeName) {
            parent = parent.parentElement;
        }

        return parent;
    },
    KillElements: function KillElements() {
        var elements = document.getElementsByClassName("_kill_me");
        var i;
        for (i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }

        var killParent = document.getElementsByClassName("_kill_parent");
        for (i = 0; i < killParent.length; i++) {
            var parent = Site.FindParent(
                killParent[i],
                killParent[i].dataset.killParentClassName
            );
            parent.parentNode.removeChild(parent);
        }
    },
    RemoveParent: function RemoveParent(thisSelector, fisrtParentHaveClassName) {
        var element = document.querySelector(thisSelector);
        var parent = Site.FindParent(element, fisrtParentHaveClassName);
        if (parent) parent.parentNode.removeChild(parent);
    },
    RemoveParentByElement: function RemoveParentByElement(element, lassName) {
        var parent = Site.FindParent(element, lassName);
        if (parent) parent.parentNode.removeChild(parent);
    },
    AddParentClassName: function AddParentClassName(
        ele,
        fisrtParentHaveClassName,
        classUpdate
    ) {
        var parent = Site.FindParent(ele, fisrtParentHaveClassName);
        if (parent) parent.classList.add(classUpdate);
        //parent.className = classUpdate;
    },
    AddClassNameInTime: function AddClassNameInTime(
        eleSelector,
        className,
        timeMs
    ) {
        var ele = document.querySelector(eleSelector);

        if (ele == null) {
            return;
        }

        ele.classList.add(className);

        setTimeout(
            function (ele, className) {
                ele.classList.remove(className);
            },
            timeMs,
            ele,
            className
        );
    },
    RemoveParentClassName: function RemoveParentClassName(
        ele,
        fisrtParentHaveClassName,
        classRemove
    ) {
        var parent = Site.FindParent(ele, fisrtParentHaveClassName);
        if (parent) parent.classList.remove(classRemove);
    },

    RemoveElementBySelector: function RemoveElementBySelector(selector) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    },
    EnableSubmitButton: function EnableSubmitButton(parentElement) {
        var btnSubmits = parentElement.querySelectorAll(
            "button,[type='reset'],[type='submit'],[name=submitType]"
        ); //[type='button']ngaoi le
        for (var i = 0; i < btnSubmits.length; i++) {
            btnSubmits[i].disabled = false;
            btnSubmits[i].classList.remove("_facebook-white-22");
        }
    },
    DisableSubmitButton: function DisableSubmitButton(parentElement) {
        var btnSubmits = parentElement.querySelectorAll(
            "button,[type='reset'],[type='submit'],[name=submitType]"
        );
        for (var i = 0; i < btnSubmits.length; i++) {
            btnSubmits[i].disabled = true;
            btnSubmits[i].classList.add("_facebook-white-22");
        }
    },
    AddAttribute: function AddAttribute(
        elesSelector,
        attributeName,
        attributeValue
    ) {
        var targetElements = document.querySelectorAll(elesSelector);

        for (var j = 0; j < targetElements.length; j++) {
            targetElements[j].setAttribute(attributeName, attributeValue);
        }
    },
    RemoveAttribute: function RemoveAttribute(elesSelector, attributeName) {
        var targetElements = document.querySelectorAll(elesSelector);

        for (var j = 0; j < targetElements.length; j++) {
            targetElements[j].removeAttribute(attributeName);
        }
    },
    SetChecked: function SetChecked(elesSelector, checked) {
        var targetElements = document.querySelectorAll(elesSelector);

        for (var j = 0; j < targetElements.length; j++) {
            targetElements[j].checked = checked;
        }
    },
    TongleAttribute: function TongleAttribute(
        chkElement,
        elesSelector,
        attributeName
    ) {
        var targetElements = document.querySelectorAll(elesSelector);

        for (var j = 0; j < targetElements.length; j++) {
            if (chkElement.checked) {
                targetElements[j].setAttribute(attributeName, "");
            } else {
                targetElements[j].removeAttribute(attributeName);
            }
        }
    },
    RevertTongleAttribute: function RevertTongleAttribute(
        chkElement,
        elesSelector,
        attributeName
    ) {
        var targetElements = document.querySelectorAll(elesSelector);

        for (var j = 0; j < targetElements.length; j++) {
            if (chkElement.checked) {
                targetElements[j].removeAttribute(attributeName);
            } else {
                targetElements[j].setAttribute(attributeName, "");
            }
        }
    },
    TongleAttributeValue: function TongleAttributeValue(
        chkElement,
        elesSelector,
        attributeName,
        falseValue,
        trueValue
    ) {
        var targetElements = document.querySelectorAll(elesSelector);
        for (var j = 0; j < targetElements.length; j++) {
            targetElements[j].setAttribute(
                attributeName,
                chkElement.checked ? trueValue : falseValue
            );
        }
    },
    TongleValue: function (
        chkElement,
        elesSelector,
        valueName,
        falseValue,
        trueValue
    ) {
        const targetElements = document.querySelectorAll(elesSelector);

        for (let j = 0; j < targetElements.length; j++) {
            if (falseValue && trueValue) {
                targetElements[j].dataset[valueName] = chkElement.checked ? trueValue : falseValue;
            } else if (targetElements[j].dataset[valueName] !== undefined) {
                delete targetElements[j].dataset[valueName];
            } else {
                targetElements[j].dataset[valueName] = chkElement.checked ? trueValue : falseValue;
            }
        }
    },
    BindingAjaxForm: function (frmSelector) {
        //Nếu item đã được remove thì parent sẽ qang exceptionnul. kiểm tra callback
        var forms = !!frmSelector
            ? document.querySelectorAll(frmSelector)
            : document.querySelectorAll("form[data-ajax=true]");
        var atr;
        var i;
        for (i = 0; i < forms.length; i++) {
            if (!forms[i]) continue;

            var glassEffect = "";

            if (!!forms[i].dataset.ajaxUpdate) {
                var updateElementSelector = forms[i].dataset.ajaxUpdate;
                glassEffect =
                    "Site.AddClass('" + updateElementSelector + "', '_ajax-process');";
            }

            var isBinding = (forms[i].dataset.isBinding != null && forms[i].dataset.isBinding);

            if (isBinding) {
                continue;
            }

            atr = forms[i].dataset.ajaxBegin;
            var blazyImage = !!forms[i].dataset.blazy;

            if (!atr) {
                forms[i].setAttribute(
                    "data-ajax-begin",
                    glassEffect + "Site.DisableSubmitButton(this);"
                );
            } else {
                //ignore not overide jquery.unobtrusive-ajax.js
                //forms[i].setAttribute("data-ajax-begin", glassEffect + "Site.DisableSubmitButton(this);" + atr);
            }

            if (forms[i].dataset.showAjaxLoading) {
                forms[i].setAttribute("data-ajax-loading", "._z-ajax-loading");
            }

            atr = forms[i].dataset.ajaxComplete;

            var execCodeResult = !!forms[i].dataset.excuteCodeResult
                ? "Site.ExcuteAjaxBcCodeResult(xhr);"
                : "";

            if (atr == null) {
                forms[i].setAttribute(
                    "data-ajax-complete",
                    "Site.BindingAjaxForm('#" +
                    forms[i].id +
                    "');Site.EnableSubmitButton(this);" +
                    execCodeResult +
                    (blazyImage ? "Site.bLazy.revalidate();" : "")
                );
            } else {
                forms[i].setAttribute(
                    "data-ajax-complete",
                    "Site.BindingAjaxForm('#" +
                    forms[i].id +
                    "');Site.EnableSubmitButton(this);" +
                    execCodeResult +
                    (blazyImage ? "Site.bLazy.revalidate();" : "") +
                    atr
                );
            }

            if (forms[i].dataset.showAjaxFailure) {
                atr = forms[i].dataset.ajaxFailure;
                if (atr == null) {
                    forms[i].setAttribute(
                        "data-ajax-failure",
                        "Site.NotifyFormFailed('LỖI AJ01','Gửi thông tin thất bại')"
                    );
                } else {
                    forms[i].setAttribute(
                        "data-ajax-failure",
                        "Site.NotifyFormFailed('LỖI AJ01','Gửi thông tin thất bại');" + atr
                    );
                }
            }

            forms[i].dataset.isBinding = true;
        }
    },
    //BindingDisableSubmitForm: function (frm) {
    //    var forms = !!frm ? [frm] : document.querySelectorAll("form[data-disable-input-submit=true]");
    //    for (var i = 0; i < forms.length; i++) {
    //        var inputs = forms[i].querySelector("input[type='text'],input[type='date'],input[type='email'],input[type='tel'],input[type='search'],input[type='number']");
    //        submitButton.click();
    //    }
    //},
    BindingLazyFormFload: function BindingLazyFormFload() {
        //Nếu item đã được remove thì parent sẽ qang exceptionnul. kiểm tra callback
        var forms = document.querySelectorAll("form[data-lazy-form=True]");
        for (var i = 0; i < forms.length; i++) {
            var submitButton = forms[i].querySelector("[name='submitType']");
            submitButton.click();
        }
    },
    BindingButtonAutoClick: function () {
        var eles = document.querySelectorAll("[data-auto-click]");
        for (var i = 0; i < eles.length; i++) {
            eles[i].click();
        }
    },
    BindingSelectAutoSubmit: function BindingSelectAutoSubmit() {
        //Nếu item đã được remove thì parent sẽ qang exceptionnul. kiểm tra callback
        var seelcts = document.querySelectorAll(
            "select[data-auto-submit=True],input[type=radio][data-auto-submit=True],input[type=checkbox][data-auto-submit=True],input[type=file][data-auto-submit=True]"
        );
        for (var i = 0; i < seelcts.length; i++) {
            seelcts[i].addEventListener("change", function (eve) {
                if (eve.target.type !== 'file' && !eve.target.dataset.autoSubmitTwoWay && eve.target.checked === false
                ) {
                    return;
                }

                if (eve.target.form) {
                    var submitButton = eve.target.form.querySelector(
                        "[data-auto-submit-button=True]"
                    );

                    if (!!submitButton && eve.target !== submitButton) {
                        submitButton.click();
                    } else {
                        eve.target.form.submit();
                    }
                }
            });
        }
    },
    ReValidateForm: function (frms) {
        if (!frms) {
            $.validator.unobtrusive.parse(document);
        } else {
            for (var i = 0; i < frms.length; i++) {
                var $form = $(frms[i]);
                $form.validate().resetForm();
                $form.removeData('validator');
                $form.removeData('unobtrusiveValidation');
                $.validator.unobtrusive.parse($form);
                ////reset unobtrusive field level, if it exists

                const invalidInputs = frms[i].querySelectorAll(".input-validation-error");
                for (let j = 0; j < invalidInputs.length; j++) {
                    invalidInputs[j].classList.remove("input-validation-error");
                }
                //console.log("ReValidateForm");
                //reset unobtrusive validation summary, if it exists
                $form
                    .find("[data-valmsg-summary=true]")
                    .removeClass("validation-summary-errors")
                    .removeClass("input-validation-error")
                    .addClass("validation-summary-valid")
                    .find("ul")
                    .empty();


                $form
                    .find("[data-valmsg-replace]")
                    .removeClass("field-validation-error")
                    .removeClass("input-validation-error")
                    .addClass("field-validation-valid")
                    .empty();
            }
        }
    },
    BeLazyRevalidate: function () {
        this.bLazy.revalidate();
    },

    ReValidateElement: function ReValidateElement(selector) {
        $.validator.unobtrusive.parse(selector);

        //get the relevant form
        var form = $(selector)
            .first()
            .closest("form");

        //get the collections of unobstrusive validators, and jquery validators
        //and compare the two
        var unobtrusiveValidation = form.data("unobtrusiveValidation");
        var validator = form.validate();

        $.each(unobtrusiveValidation.options.rules, function (elname, elrules) {
            if (validator.settings.rules[elname] == undefined) {
                var args = {};
                $.extend(args, elrules);
                args.messages = unobtrusiveValidation.options.messages[elname];
                //edit:use quoted strings for the name selector
                $("[name='" + elname + "']").rules("add", args);
            } else {
                $.each(elrules, function (rulename, data) {
                    if (validator.settings.rules[elname][rulename] == undefined) {
                        var args = {};
                        args[rulename] = data;
                        args.messages =
                            unobtrusiveValidation.options.messages[elname][rulename];
                        //edit:use quoted strings for the name selector
                        $("[name='" + elname + "']").rules("add", args);
                    }
                });
            }
        });
    },
    BindingRemoveItems: function BindingRemoveItems() {
        //Nếu item đã được remove thì parent sẽ qang exceptionnul. kiểm tra callback
        var btns = document.querySelectorAll("[data-onclick-remove-item]");
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function (eve) {
                var itemSelector = eve.target.dataset.onclickRemoveItem;
                var removeItems = document.querySelectorAll(itemSelector);

                for (var j = 0; j < removeItems.length; j++) {
                    removeItems[j].remove();
                }

                var f = new Function(eve.target.dataset.callback);
                return f();
            });
        }
    },
    ShowMaskBlack: function (zIndex, maskId ="maskBlack") {
        var maskElement = document.getElementById(maskId);
        maskElement.classList = "visible";
        maskElement.style.zIndex = zIndex;
    },
    HideMaskBlack: function () {
        var maskElement = document.getElementById("maskBlack");
        maskElement.classList = "";
        maskElement.style.zIndex = -1;
    },
    LoadAjaxReturn: function LoadAjaxReturn(data, textStatus, jqXHR) {
        if (textStatus === "success") {
            Site.Notify(
                data.title,
                data.text,
                data.hide,
                data.type,
                data.promptDefault,
                data.buttonCloser
            );
            if (data.jsAction) {
                var f = new Function(data.jsAction);
                return f();
            }
        } else {
            new PNotify({
                title: "CẢNH BÁO!",
                text: "Gửi dữ liệu tới server thất bại",
                type: "error"
            });
        }
        return null;
    },
    SetFocus: function SetFocus(inputSelector) {
        var ele = document.querySelector(inputSelector);
        if (!!ele) {
            ele.focus();
        }
    },
    BindingCheckbox: function BindingCheckbox() {
        var chks = document.querySelectorAll("[data-class-name-checked]");

        for (var i = 0; i < chks.length; i++) {
            chks[i].addEventListener("change", function (eve) {
                var classCheck = eve.target.dataset.classNameChecked;
                var classUnCheck = eve.target.dataset.classNameUnchecked;
                var elementSelector = eve.target.dataset.elementTargetSelector;
                var targetElements = document.querySelectorAll(elementSelector);

                for (var j = 0; j < targetElements.length; j++) {
                    targetElements[j].className = eve.target.checked
                        ? classCheck
                        : classUnCheck;
                }
            });
        }
    },
    InputNumberMaxValue: function InputNumberMaxValue() {
        var inps = document.querySelectorAll("input[data-max-value]");

        for (var i = 0; i < inps.length; i++) {
            inps[i].addEventListener("keyup", function (eve) {
                if (+eve.target.value > +eve.target.dataset.maxValue) {
                    eve.target.value = eve.target.dataset.maxValue;
                }
            });
        }
    },

    ChangeDisabledState: function ChangeDisabledState(elementSelector, isEnable) {
        var elements = document.querySelectorAll(elementSelector);

        for (var i = 0; i < elements.length; i++) {
            elements[i].disabled = !isEnable;
        }
    },
    TongleActive: function TongleActive(element) {
        element.classList.toggle("active");
    },
    TongleClass: function TongleClass(elementSelector, className) {
        var elements = document.querySelectorAll(elementSelector);

        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.toggle(className);
        }
    },
    TongleClassElement: function TongleClassElement(ele, className) {
        ele.classList.toggle(className);
    },
    TongleClass2: function TongleClass2(elementSelector, classA, classB) {
        var elements = document.querySelectorAll(elementSelector);

        for (var i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains(classA)) {
                elements[i].classList.remove(classA);
                elements[i].classList.add(classB);
            } else if (elements[i].classList.contains(classB)) {
                elements[i].classList.remove(classB);
                elements[i].classList.add(classA);
            }
        }
    },
    RemoveClass: function RemoveClass(selector, className, excludeElement) {
        var targetEles = document.querySelectorAll(selector);

        for (var i = 0; i < targetEles.length; i++) {
            if (targetEles[i] === excludeElement) {
                continue;
            }
            targetEles[i].classList.remove(className);
        }
    },
    AddClass: function AddClass(selector, className) {
        var targetEles = document.querySelectorAll(selector);

        for (var i = 0; i < targetEles.length; i++) {
            targetEles[i].classList.add(className);
        }
    },
    RemoveClassElement: function RemoveClassElement(ele, className) {
        ele.classList.remove(className);
    },
    AddClassElement: function AddClassElement(ele, className) {
        ele.classList.add(className);
    },
    LoadLayout: function LoadLayout() {
        document.getElementsByTagName("body")[0].classList.remove("pending");
        document.getElementsByTagName("body")[0].classList.add("complete");
        var langs = document.getElementsByName("Language");
        for (var i = 0; i < langs.length; i++) {
            langs[i].addEventListener("click", function () {
                var form = document.getElementById("selectLanguage");
                form.submit();
            });
        }
    },
    HtmlToElement: function (html, removeEmptyNode = false) {
        var template = document.createElement("template");
        template.innerHTML = html;
        var listResult = [];
        for (var i = 0; i < template.content.childNodes.length; i++) {
            if (template.content.childNodes[i].nodeName === "#text") {
                var textNode = document.createTextNode(
                    template.content.childNodes[i].textContent
                );

                if (removeEmptyNode) {
                    if (!!textNode.textContent.trim()) {
                        listResult.push(textNode);
                    }
                }
                else {
                    listResult.push(textNode);
                }
            } else {
                listResult.push(template.content.childNodes[i]);
            }
        }
        return listResult;
    },
    // converting initialize data
    Extend: function Extend(data) {
        data = data || {};
        Site.size = data.size || 300;
        Site.page = data.page || 1;
        Site.step = data.step || 3;
    },
    MomentTime: function MomentTime() {
        var eles = document.querySelectorAll("[data-moment-time]");
        for (var i = 0; i < eles.length; i++) {
            eles[i].innerHTML = window.moment(eles[i].dataset.momentTime).fromNow();
        }
    },
    BindingScrollModelBox: function BindingScrollModelBox() { },
    ExecuteFunctionByName: function ExecuteFunctionByName(functionName, context) {
        //stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
        var args = Array.prototype.slice.call(arguments, 2);
        return context[functionName].apply(context, args);
    },
    ExcuteAjaxBcCodeResult: function ExcuteAjaxBcCodeResult(xhr) {
        var obj = xhr.responseJSON;

        if (!!obj && !!obj.pNotify) eval(obj.pNotify);

        if (!!obj && !!obj.jsScript) eval(obj.jsScript);
    },
    ShowWindowLoadding: function () {
        const ele = document.querySelector("._z-ajax-loading");
        ele.classList.add("show");
    },
    HideWindowLoadding: function () {
        const ele = document.querySelector("._z-ajax-loading");
        ele.classList.remove("show");
    },
    BindingOnCroll: function () {
        window.addEventListener('scroll', function() {
            var elements = document.querySelectorAll("[data-in-view-action]");
            for (var i = 0; i < elements.length; i++) {
                if (Site.IsElementInView(elements[i], false)) {
                    if (elements[i].dataset.inViewAction) {
                        var f = new Function(elements[i].dataset.inViewAction);
                        f();

                        if (!elements[i].hasAttribute("data-in-view-keep-action")) {
                            elements[i].removeAttribute("data-in-view-action");
                        }
                    }
                }
            };
        });
    },
    IsElementInView: function (elem) {
        var bounding = elem.getBoundingClientRect();
        return (
            bounding.top >= 0 &&
                bounding.left >= 0 &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    // init
    Init: function Init(data) {
        WNumbHelper.Init();
        Site.Extend(data);
        Site.LoadLayout();
        Site.ConsumeAlert();
        Site.InnitPopup();
        Site.InnitAutoHide();
        Site.InnitAutoShow();
        Site.BindingCheckbox();
        Site.BindingAjaxForm();
        Site.BindingLazyFormFload();
        Site.BindingScrollModelBox();
        Site.BindingButtonAutoClick();
    },
    IsScrolledInsizeView: function (elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    },
    IsScrolledIntoViewJs: function (elem) {
        var docViewTop = document.documentElement.scrollTop || document.body.scrollTop;
        var docViewBottom = docViewTop + window.innerHeight;
        
        var elemTop = elem.getBoundingClientRect().y;
        return (elemTop <= docViewBottom) && (elemTop >= docViewTop);
    }
};

/** * * * * * * * * * * * * * * *
 * Initialization
 * * * * * * * * * * * * * * * * */

var init = function init() {
    $("form").keypress(function (e) {
        //Enter key
        var key = e.charCode || e.keyCode || 0;
        if (key === 13) {
            e.preventDefault();
        };
    });

    PNotify.prototype.options.delay = 1500;
    Site.Init({
        size: 30, // pages size
        page: 1, // selected page
        step: 3 // pages before and after current
    });

    Site.bLazy = new Blazy({
        success: function success(element) {
            //console.log("Element loaded: ", element.nodeName);
        },
        error: function error(ele, msg) {
            ele.removeAttribute("src");
            if (msg === "missing") {
                ele.src = "";
                console.log("missing");
            } else if (msg === "invalid") {
                console.log("invalid");

                ele.src = "";
            }
        }
    });

    // If element is scrolled into view, fade it in
    var checkScrool = document.querySelector(".scroll-animations");

    if (!!checkScrool) {
        $(window).scroll(function() {
            $('.scroll-animations .animated').each(function() {
                if (Site.IsScrolledInsideView(this) === true) {
                    if (!!this.dataset.animationClass) {
                        $(this).addClass(this.dataset.animationClass);
                    }
                }
            });
        });
    }

    //Remove hidden element
    var hiddenElements = document.querySelectorAll("[hidden]");

    for (var i = 0; i < hiddenElements.length; i++) {
        hiddenElements[i].removeAttribute("hidden");
    }
   
};

document.addEventListener("DOMContentLoaded", init, false);
