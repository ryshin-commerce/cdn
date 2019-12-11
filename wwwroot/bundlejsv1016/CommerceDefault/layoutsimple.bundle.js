//https://stackoverflow.com/questions/47125439/uploading-image-asp-net-core
// Unobtrusive Ajax support library for jQuery
// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
// @version <placeholder>
// 
// Microsoft grants you the right to use these script files for the sole
// purpose of either: (i) interacting through your browser with the Microsoft
// website or online service, subject to the applicable licensing or use
// terms; or (ii) using the files as included with a Microsoft product subject
// to that product's license terms. Microsoft reserves all other rights to the
// files not expressly granted by Microsoft, whether by implication, estoppel
// or otherwise. Insofar as a script file is dual licensed under GPL,
// Microsoft neither took the code under GPL nor distributes it thereunder but
// under the terms set out in this paragraph. All notices and licenses
// below are for informational purposes only.

/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false */
/*global window: false, jQuery: false */

(function ($) {
    var data_click = "unobtrusiveAjaxClick",
        data_target = "unobtrusiveAjaxClickTarget",
        data_validation = "unobtrusiveValidation";

    function getFunction(code, argNames) {
        var fn = window, parts = (code || "").split(".");
        while (fn && parts.length) {
            fn = fn[parts.shift()];
        }
        if (typeof (fn) === "function") {
            return fn;
        }
        argNames.push(code);
        return Function.constructor.apply(null, argNames);
    }

    function isMethodProxySafe(method) {
        return method === "GET" || method === "POST";
    }

    function asyncOnBeforeSend(xhr, method) {
        if (!isMethodProxySafe(method)) {
            xhr.setRequestHeader("X-HTTP-Method-Override", method);
        }
    }

    function asyncOnSuccess(element, data, contentType) {
        var mode;

        if (contentType.indexOf("application/x-javascript") !== -1) {  // jQuery already executes JavaScript for us
            return;
        }

        mode = (element.getAttribute("data-ajax-mode") || "").toUpperCase();
        $(element.getAttribute("data-ajax-update")).each(function (i, update) {
            var top;

            switch (mode) {
                case "BEFORE":
                    $(update).prepend(data);
                    break;
                case "AFTER":
                    $(update).append(data);
                    break;
                case "REPLACE-WITH":
                    $(update).replaceWith(data);
                    break;
                default:
                    $(update).html(data);
                    break;
            }
        });
    }

    function asyncRequest(element, options) {
        var confirm, loading, method, duration;

        confirm = element.getAttribute("data-ajax-confirm");
        if (confirm && !window.confirm(confirm)) {
            return;
        }

        loading = $(element.getAttribute("data-ajax-loading"));
        duration = parseInt(element.getAttribute("data-ajax-loading-duration"), 10) || 0;

        $.extend(options, {
            type: element.getAttribute("data-ajax-method") || undefined,
            url: element.getAttribute("data-ajax-url") || undefined,
            cache: (element.getAttribute("data-ajax-cache") || "").toLowerCase() === "true",
            beforeSend: function (xhr) {
                var result;
                asyncOnBeforeSend(xhr, method);
                result = getFunction(element.getAttribute("data-ajax-begin"), ["xhr"]).apply(element, arguments);
                if (result !== false) {
                    loading.show(duration);
                }
                return result;
            },
            complete: function () {
                loading.hide(duration);
                getFunction(element.getAttribute("data-ajax-complete"), ["xhr", "status"]).apply(element, arguments);
            },
            success: function (data, status, xhr) {
                asyncOnSuccess(element, data, xhr.getResponseHeader("Content-Type") || "text/html");
                getFunction(element.getAttribute("data-ajax-success"), ["data", "status", "xhr"]).apply(element, arguments);
            },
            error: function () {
                getFunction(element.getAttribute("data-ajax-failure"), ["xhr", "status", "error"]).apply(element, arguments);
            }
        });

        options.data.push({ name: "X-Requested-With", value: "XMLHttpRequest" });

        method = options.type.toUpperCase();
        if (options.data instanceof FormData) {
            options.processData = false;
            options.contentType = false;
            options.data.append("X-Requested-With", "XMLHttpRequest");

            if (!isMethodProxySafe(method)) {
                options.type = "POST";
                options.data.append("X-HTTP-Method-Override", method);
            }
        } else {
            options.data.push({ name: "X-Requested-With", value: "XMLHttpRequest" });

            if (!isMethodProxySafe(method)) {
                options.type = "POST";
                options.data.push({ name: "X-HTTP-Method-Override", value: method });
            }
        }

        // change here:
        // Check for a Form POST with enctype=multipart/form-data
        // add the input file that were not previously included in the serializeArray()
        // set processData and contentType to false
        var $element = $(element);
        if ($element.is("form") && $element.attr("enctype") == "multipart/form-data") {
            var formdata = new FormData();
            $.each(options.data, function (i, v) {
                formdata.append(v.name, v.value);
            });
            $("input[type=file]", $element).each(function () {
                var file = this;
                $.each(file.files, function (n, v) {
                    formdata.append(file.name, v);
                });
            });
            $.extend(options, {
                processData: false,
                contentType: false,
                data: formdata
            });
        }
        // end change

        $.ajax(options);
    }

    function validate(form) {
        var validationInfo = $(form).data(data_validation);
        return !validationInfo || !validationInfo.validate || validationInfo.validate();
    }

    $(document).on("click", "a[data-ajax=true]", function (evt) {
        evt.preventDefault();
        asyncRequest(this, {
            url: this.href,
            type: "GET",
            data: []
        });
    });

    $(document).on("click", "form[data-ajax=true] input[type=image]", function (evt) {
        var name = evt.target.name,
            target = $(evt.target),
            form = $(target.parents("form")[0]),
            offset = target.offset();

        form.data(data_click, [
            { name: name + ".x", value: Math.round(evt.pageX - offset.left) },
            { name: name + ".y", value: Math.round(evt.pageY - offset.top) }
        ]);

        setTimeout(function () {
            form.removeData(data_click);
        }, 0);
    });

    $(document).on("click", "form[data-ajax=true] :submit", function (evt) {
        var name = evt.currentTarget.name,
            target = $(evt.target),
            form = $(target.parents("form")[0]);

        form.data(data_click, name ? [{ name: name, value: evt.currentTarget.value }] : []);
        form.data(data_target, target);

        setTimeout(function () {
            form.removeData(data_click);
            form.removeData(data_target);
        }, 0);
    });

    $(document).on("submit", "form[data-ajax=true]", function (evt) {
        var clickInfo = $(this).data(data_click) || [],
            clickTarget = $(this).data(data_target),
            isCancel = clickTarget && clickTarget.hasClass("cancel");
        evt.preventDefault();
        if (!isCancel && !validate(this)) {
            return;
        }
        var formData;
        if (this.enctype && this.enctype === "multipart/form-data") {
            formData = new FormData(this);
        } else {
            formData = clickInfo.concat($(this).serializeArray());
        }

        asyncRequest(this, {
            url: this.action,
            type: this.method || "GET",
            data: clickInfo.concat($(this).serializeArray())
        });
    });
}(jQuery));

/*
PNotify 3.2.0 sciactive.com/pnotify/
(C) 2015 Hunter Perrin; Google, Inc.
license Apache-2.0
*/
!function(t,i){"function"==typeof define&&define.amd?define("pnotify",["jquery"],function(s){return i(s,t)}):"object"==typeof exports&&"undefined"!=typeof module?module.exports=i(require("jquery"),global||t):t.PNotify=i(t.jQuery,t)}("undefined"!=typeof window?window:this,function(t,i){var s=function(i){var e,o,n={dir1:"down",dir2:"left",push:"bottom",spacing1:36,spacing2:36,context:t("body"),modal:!1},a=t(i),r=function(){o=t("body"),c.prototype.options.stack.context=o,a=t(i),a.bind("resize",function(){e&&clearTimeout(e),e=setTimeout(function(){c.positionAll(!0)},10)})},h=function(i){var s=t("<div />",{class:"ui-pnotify-modal-overlay"});return s.prependTo(i.context),i.overlay_close&&s.click(function(){c.removeStack(i)}),s},c=function(t){this.state="initializing",this.timer=null,this.animTimer=null,this.styles=null,this.elem=null,this.container=null,this.title_container=null,this.text_container=null,this.animating=!1,this.timerHide=!1,this.parseOptions(t),this.init()};return t.extend(c.prototype,{version:"3.2.0",options:{title:!1,title_escape:!1,text:!1,text_escape:!1,styling:"brighttheme",addclass:"",cornerclass:"",auto_display:!0,width:"300px",min_height:"16px",type:"notice",icon:!0,animation:"fade",animate_speed:"normal",shadow:!0,hide:!0,delay:8e3,mouse_reset:!0,remove:!0,insert_brs:!0,destroy:!0,stack:n},modules:{},runModules:function(t,i){var s;for(var e in this.modules)s="object"==typeof i&&e in i?i[e]:i,"function"==typeof this.modules[e][t]&&(this.modules[e].notice=this,this.modules[e].options="object"==typeof this.options[e]?this.options[e]:{},this.modules[e][t](this,"object"==typeof this.options[e]?this.options[e]:{},s))},init:function(){var i=this;return this.modules={},t.extend(!0,this.modules,c.prototype.modules),"object"==typeof this.options.styling?this.styles=this.options.styling:this.styles=c.styling[this.options.styling],this.elem=t("<div />",{class:"ui-pnotify "+this.options.addclass,css:{display:"none"},"aria-live":"assertive","aria-role":"alertdialog",mouseenter:function(t){if(i.options.mouse_reset&&"out"===i.animating){if(!i.timerHide)return;i.cancelRemove()}i.options.hide&&i.options.mouse_reset&&i.cancelRemove()},mouseleave:function(t){i.options.hide&&i.options.mouse_reset&&"out"!==i.animating&&i.queueRemove(),c.positionAll()}}),"fade"===this.options.animation&&this.elem.addClass("ui-pnotify-fade-"+this.options.animate_speed),this.container=t("<div />",{class:this.styles.container+" ui-pnotify-container "+("error"===this.options.type?this.styles.error:"info"===this.options.type?this.styles.info:"success"===this.options.type?this.styles.success:this.styles.notice),role:"alert"}).appendTo(this.elem),""!==this.options.cornerclass&&this.container.removeClass("ui-corner-all").addClass(this.options.cornerclass),this.options.shadow&&this.container.addClass("ui-pnotify-shadow"),!1!==this.options.icon&&t("<div />",{class:"ui-pnotify-icon"}).append(t("<span />",{class:!0===this.options.icon?"error"===this.options.type?this.styles.error_icon:"info"===this.options.type?this.styles.info_icon:"success"===this.options.type?this.styles.success_icon:this.styles.notice_icon:this.options.icon})).prependTo(this.container),this.title_container=t("<h4 />",{class:"ui-pnotify-title"}).appendTo(this.container),!1===this.options.title?this.title_container.hide():this.options.title_escape?this.title_container.text(this.options.title):this.title_container.html(this.options.title),this.text_container=t("<div />",{class:"ui-pnotify-text","aria-role":"alert"}).appendTo(this.container),!1===this.options.text?this.text_container.hide():this.options.text_escape?this.text_container.text(this.options.text):this.text_container.html(this.options.insert_brs?String(this.options.text).replace(/\n/g,"<br />"):this.options.text),"string"==typeof this.options.width&&this.elem.css("width",this.options.width),"string"==typeof this.options.min_height&&this.container.css("min-height",this.options.min_height),"top"===this.options.stack.push?c.notices=t.merge([this],c.notices):c.notices=t.merge(c.notices,[this]),"top"===this.options.stack.push&&this.queuePosition(!1,1),this.options.stack.animation=!1,this.runModules("init"),this.state="closed",this.options.auto_display&&this.open(),this},update:function(i){var s=this.options;return this.parseOptions(s,i),this.elem.removeClass("ui-pnotify-fade-slow ui-pnotify-fade-normal ui-pnotify-fade-fast"),"fade"===this.options.animation&&this.elem.addClass("ui-pnotify-fade-"+this.options.animate_speed),this.options.cornerclass!==s.cornerclass&&this.container.removeClass("ui-corner-all "+s.cornerclass).addClass(this.options.cornerclass),this.options.shadow!==s.shadow&&(this.options.shadow?this.container.addClass("ui-pnotify-shadow"):this.container.removeClass("ui-pnotify-shadow")),!1===this.options.addclass?this.elem.removeClass(s.addclass):this.options.addclass!==s.addclass&&this.elem.removeClass(s.addclass).addClass(this.options.addclass),!1===this.options.title?this.title_container.slideUp("fast"):this.options.title!==s.title&&(this.options.title_escape?this.title_container.text(this.options.title):this.title_container.html(this.options.title),!1===s.title&&this.title_container.slideDown(200)),!1===this.options.text?this.text_container.slideUp("fast"):this.options.text!==s.text&&(this.options.text_escape?this.text_container.text(this.options.text):this.text_container.html(this.options.insert_brs?String(this.options.text).replace(/\n/g,"<br />"):this.options.text),!1===s.text&&this.text_container.slideDown(200)),this.options.type!==s.type&&this.container.removeClass(this.styles.error+" "+this.styles.notice+" "+this.styles.success+" "+this.styles.info).addClass("error"===this.options.type?this.styles.error:"info"===this.options.type?this.styles.info:"success"===this.options.type?this.styles.success:this.styles.notice),(this.options.icon!==s.icon||!0===this.options.icon&&this.options.type!==s.type)&&(this.container.find("div.ui-pnotify-icon").remove(),!1!==this.options.icon&&t("<div />",{class:"ui-pnotify-icon"}).append(t("<span />",{class:!0===this.options.icon?"error"===this.options.type?this.styles.error_icon:"info"===this.options.type?this.styles.info_icon:"success"===this.options.type?this.styles.success_icon:this.styles.notice_icon:this.options.icon})).prependTo(this.container)),this.options.width!==s.width&&this.elem.animate({width:this.options.width}),this.options.min_height!==s.min_height&&this.container.animate({minHeight:this.options.min_height}),this.options.hide?s.hide||this.queueRemove():this.cancelRemove(),this.queuePosition(!0),this.runModules("update",s),this},open:function(){this.state="opening",this.runModules("beforeOpen");var t=this;return this.elem.parent().length||this.elem.appendTo(this.options.stack.context?this.options.stack.context:o),"top"!==this.options.stack.push&&this.position(!0),this.animateIn(function(){t.queuePosition(!0),t.options.hide&&t.queueRemove(),t.state="open",t.runModules("afterOpen")}),this},remove:function(s){this.state="closing",this.timerHide=!!s,this.runModules("beforeClose");var e=this;return this.timer&&(i.clearTimeout(this.timer),this.timer=null),this.animateOut(function(){if(e.state="closed",e.runModules("afterClose"),e.queuePosition(!0),e.options.remove&&e.elem.detach(),e.runModules("beforeDestroy"),e.options.destroy&&null!==c.notices){var i=t.inArray(e,c.notices);-1!==i&&c.notices.splice(i,1)}e.runModules("afterDestroy")}),this},get:function(){return this.elem},parseOptions:function(i,s){this.options=t.extend(!0,{},c.prototype.options),this.options.stack=c.prototype.options.stack;for(var e,o=[i,s],n=0;n<o.length&&void 0!==(e=o[n]);n++)if("object"!=typeof e)this.options.text=e;else for(var a in e)this.modules[a]?t.extend(!0,this.options[a],e[a]):this.options[a]=e[a]},animateIn:function(t){this.animating="in";var i=this,s=function(){i.animTimer&&clearTimeout(i.animTimer),"in"===i.animating&&(i.elem.is(":visible")?(t&&t.call(),i.animating=!1):i.animTimer=setTimeout(s,40))};"fade"===this.options.animation?(this.elem.one("webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionend",s).addClass("ui-pnotify-in"),this.elem.css("opacity"),this.elem.addClass("ui-pnotify-fade-in"),this.animTimer=setTimeout(s,650)):(this.elem.addClass("ui-pnotify-in"),s())},animateOut:function(i){this.animating="out";var s=this,e=function(){if(s.animTimer&&clearTimeout(s.animTimer),"out"===s.animating)if("0"!=s.elem.css("opacity")&&s.elem.is(":visible"))s.animTimer=setTimeout(e,40);else{if(s.elem.removeClass("ui-pnotify-in"),s.options.stack.overlay){var o=!1;t.each(c.notices,function(t,i){i!=s&&i.options.stack===s.options.stack&&"closed"!=i.state&&(o=!0)}),o||s.options.stack.overlay.hide()}i&&i.call(),s.animating=!1}};"fade"===this.options.animation?(this.elem.one("webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionend",e).removeClass("ui-pnotify-fade-in"),this.animTimer=setTimeout(e,650)):(this.elem.removeClass("ui-pnotify-in"),e())},position:function(t){var i=this.options.stack,s=this.elem;if(void 0===i.context&&(i.context=o),i){"number"!=typeof i.nextpos1&&(i.nextpos1=i.firstpos1),"number"!=typeof i.nextpos2&&(i.nextpos2=i.firstpos2),"number"!=typeof i.addpos2&&(i.addpos2=0);var e=!s.hasClass("ui-pnotify-in");if(!e||t){i.modal&&(i.overlay?i.overlay.show():i.overlay=h(i)),s.addClass("ui-pnotify-move");var n,r,c;switch(i.dir1){case"down":c="top";break;case"up":c="bottom";break;case"left":c="right";break;case"right":c="left"}n=parseInt(s.css(c).replace(/(?:\..*|[^0-9.])/g,"")),isNaN(n)&&(n=0),void 0!==i.firstpos1||e||(i.firstpos1=n,i.nextpos1=i.firstpos1);var p;switch(i.dir2){case"down":p="top";break;case"up":p="bottom";break;case"left":p="right";break;case"right":p="left"}switch(r=parseInt(s.css(p).replace(/(?:\..*|[^0-9.])/g,"")),isNaN(r)&&(r=0),void 0!==i.firstpos2||e||(i.firstpos2=r,i.nextpos2=i.firstpos2),("down"===i.dir1&&i.nextpos1+s.height()>(i.context.is(o)?a.height():i.context.prop("scrollHeight"))||"up"===i.dir1&&i.nextpos1+s.height()>(i.context.is(o)?a.height():i.context.prop("scrollHeight"))||"left"===i.dir1&&i.nextpos1+s.width()>(i.context.is(o)?a.width():i.context.prop("scrollWidth"))||"right"===i.dir1&&i.nextpos1+s.width()>(i.context.is(o)?a.width():i.context.prop("scrollWidth")))&&(i.nextpos1=i.firstpos1,i.nextpos2+=i.addpos2+(void 0===i.spacing2?25:i.spacing2),i.addpos2=0),"number"==typeof i.nextpos2&&(i.animation?s.css(p,i.nextpos2+"px"):(s.removeClass("ui-pnotify-move"),s.css(p,i.nextpos2+"px"),s.css(p),s.addClass("ui-pnotify-move"))),i.dir2){case"down":case"up":s.outerHeight(!0)>i.addpos2&&(i.addpos2=s.height());break;case"left":case"right":s.outerWidth(!0)>i.addpos2&&(i.addpos2=s.width())}switch("number"==typeof i.nextpos1&&(i.animation?s.css(c,i.nextpos1+"px"):(s.removeClass("ui-pnotify-move"),s.css(c,i.nextpos1+"px"),s.css(c),s.addClass("ui-pnotify-move"))),i.dir1){case"down":case"up":i.nextpos1+=s.height()+(void 0===i.spacing1?25:i.spacing1);break;case"left":case"right":i.nextpos1+=s.width()+(void 0===i.spacing1?25:i.spacing1)}}return this}},queuePosition:function(t,i){return e&&clearTimeout(e),i||(i=10),e=setTimeout(function(){c.positionAll(t)},i),this},cancelRemove:function(){return this.timer&&i.clearTimeout(this.timer),this.animTimer&&i.clearTimeout(this.animTimer),"closing"===this.state&&(this.state="open",this.animating=!1,this.elem.addClass("ui-pnotify-in"),"fade"===this.options.animation&&this.elem.addClass("ui-pnotify-fade-in")),this},queueRemove:function(){var t=this;return this.cancelRemove(),this.timer=i.setTimeout(function(){t.remove(!0)},isNaN(this.options.delay)?0:this.options.delay),this}}),t.extend(c,{notices:[],reload:s,removeAll:function(){t.each(c.notices,function(t,i){i.remove&&i.remove(!1)})},removeStack:function(i){t.each(c.notices,function(t,s){s.remove&&s.options.stack===i&&s.remove(!1)})},positionAll:function(i){if(e&&clearTimeout(e),e=null,c.notices&&c.notices.length)t.each(c.notices,function(t,s){var e=s.options.stack;e&&(e.overlay&&e.overlay.hide(),e.nextpos1=e.firstpos1,e.nextpos2=e.firstpos2,e.addpos2=0,e.animation=i)}),t.each(c.notices,function(t,i){i.position()});else{var s=c.prototype.options.stack;s&&(delete s.nextpos1,delete s.nextpos2)}},styling:{brighttheme:{container:"brighttheme",notice:"brighttheme-notice",notice_icon:"brighttheme-icon-notice",info:"brighttheme-info",info_icon:"brighttheme-icon-info",success:"brighttheme-success",success_icon:"brighttheme-icon-success",error:"brighttheme-error",error_icon:"brighttheme-icon-error"},bootstrap3:{container:"alert",notice:"alert-warning",notice_icon:"glyphicon glyphicon-exclamation-sign",info:"alert-info",info_icon:"glyphicon glyphicon-info-sign",success:"alert-success",success_icon:"glyphicon glyphicon-ok-sign",error:"alert-danger",error_icon:"glyphicon glyphicon-warning-sign"}}}),c.styling.fontawesome=t.extend({},c.styling.bootstrap3),t.extend(c.styling.fontawesome,{notice_icon:"fa fa-exclamation-circle",info_icon:"fa fa-info",success_icon:"fa fa-check",error_icon:"fa fa-warning"}),i.document.body?r():t(r),c};return s(i)});
//# sourceMappingURL=pnotify.js.map
// Buttons
!function(o,s){"function"==typeof define&&define.amd?define("pnotify.buttons",["jquery","pnotify"],s):"object"==typeof exports&&"undefined"!=typeof module?module.exports=s(require("jquery"),require("./pnotify")):s(o.jQuery,o.PNotify)}("undefined"!=typeof window?window:this,function(o,s){return s.prototype.options.buttons={closer:!0,closer_hover:!0,sticker:!0,sticker_hover:!0,show_on_nonblock:!1,labels:{close:"Close",stick:"Stick",unstick:"Unstick"},classes:{closer:null,pin_up:null,pin_down:null}},s.prototype.modules.buttons={init:function(s,i){var n=this;s.elem.on({mouseenter:function(o){!n.options.sticker||s.options.nonblock&&s.options.nonblock.nonblock&&!n.options.show_on_nonblock||n.sticker.trigger("pnotify:buttons:toggleStick").css("visibility","visible"),!n.options.closer||s.options.nonblock&&s.options.nonblock.nonblock&&!n.options.show_on_nonblock||n.closer.css("visibility","visible")},mouseleave:function(o){n.options.sticker_hover&&n.sticker.css("visibility","hidden"),n.options.closer_hover&&n.closer.css("visibility","hidden")}}),this.sticker=o("<div />",{class:"ui-pnotify-sticker","aria-role":"button","aria-pressed":s.options.hide?"false":"true",tabindex:"0",title:s.options.hide?i.labels.stick:i.labels.unstick,css:{cursor:"pointer",visibility:i.sticker_hover?"hidden":"visible"},click:function(){s.options.hide=!s.options.hide,s.options.hide?s.queueRemove():s.cancelRemove(),o(this).trigger("pnotify:buttons:toggleStick")}}).bind("pnotify:buttons:toggleStick",function(){var i=null===n.options.classes.pin_up?s.styles.pin_up:n.options.classes.pin_up,e=null===n.options.classes.pin_down?s.styles.pin_down:n.options.classes.pin_down;o(this).attr("title",s.options.hide?n.options.labels.stick:n.options.labels.unstick).children().attr("class","").addClass(s.options.hide?i:e).attr("aria-pressed",s.options.hide?"false":"true")}).append("<span />").trigger("pnotify:buttons:toggleStick").prependTo(s.container),(!i.sticker||s.options.nonblock&&s.options.nonblock.nonblock&&!i.show_on_nonblock)&&this.sticker.css("display","none"),this.closer=o("<div />",{class:"ui-pnotify-closer","aria-role":"button",tabindex:"0",title:i.labels.close,css:{cursor:"pointer",visibility:i.closer_hover?"hidden":"visible"},click:function(){s.remove(!1),n.sticker.css("visibility","hidden"),n.closer.css("visibility","hidden")}}).append(o("<span />",{class:null===i.classes.closer?s.styles.closer:i.classes.closer})).prependTo(s.container),(!i.closer||s.options.nonblock&&s.options.nonblock.nonblock&&!i.show_on_nonblock)&&this.closer.css("display","none")},update:function(o,s){!s.closer||o.options.nonblock&&o.options.nonblock.nonblock&&!s.show_on_nonblock?this.closer.css("display","none"):s.closer&&this.closer.css("display","block"),!s.sticker||o.options.nonblock&&o.options.nonblock.nonblock&&!s.show_on_nonblock?this.sticker.css("display","none"):s.sticker&&this.sticker.css("display","block"),this.sticker.trigger("pnotify:buttons:toggleStick"),this.closer.find("span").attr("class","").addClass(null===s.classes.closer?o.styles.closer:s.classes.closer),s.sticker_hover?this.sticker.css("visibility","hidden"):o.options.nonblock&&o.options.nonblock.nonblock&&!s.show_on_nonblock||this.sticker.css("visibility","visible"),s.closer_hover?this.closer.css("visibility","hidden"):o.options.nonblock&&o.options.nonblock.nonblock&&!s.show_on_nonblock||this.closer.css("visibility","visible")}},o.extend(s.styling.brighttheme,{closer:"brighttheme-icon-closer",pin_up:"brighttheme-icon-sticker",pin_down:"brighttheme-icon-sticker brighttheme-icon-stuck"}),o.extend(s.styling.bootstrap3,{closer:"glyphicon glyphicon-remove",pin_up:"glyphicon glyphicon-pause",pin_down:"glyphicon glyphicon-play"}),o.extend(s.styling.fontawesome,{closer:"fa fa-times",pin_up:"fa fa-pause",pin_down:"fa fa-play"}),s});
//# sourceMappingURL=pnotify.buttons.js.map
// Desktop
!function(i,t){"function"==typeof define&&define.amd?define("pnotify.desktop",["jquery","pnotify"],t):"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("jquery"),require("./pnotify")):t(i.jQuery,i.PNotify)}("undefined"!=typeof window?window:this,function(i,t){var o,n=function(i,t){return(n="Notification"in window?function(i,t){return new Notification(i,t)}:"mozNotification"in navigator?function(i,t){return navigator.mozNotification.createNotification(i,t.body,t.icon).show()}:"webkitNotifications"in window?function(i,t){return window.webkitNotifications.createNotification(t.icon,i,t.body)}:function(i,t){return null})(i,t)};return t.prototype.options.desktop={desktop:!1,fallback:!0,icon:null,tag:null,title:null,text:null},t.prototype.modules.desktop={genNotice:function(i,t){null===t.icon?this.icon="http://sciactive.com/pnotify/includes/desktop/"+i.options.type+".png":!1===t.icon?this.icon=null:this.icon=t.icon,null!==this.tag&&null===t.tag||(this.tag=null===t.tag?"PNotify-"+Math.round(1e6*Math.random()):t.tag),i.desktop=n(t.title||i.options.title,{icon:this.icon,body:t.text||i.options.text,tag:this.tag}),!("close"in i.desktop)&&"cancel"in i.desktop&&(i.desktop.close=function(){i.desktop.cancel()}),i.desktop.onclick=function(){i.elem.trigger("click")},i.desktop.onclose=function(){"closing"!==i.state&&"closed"!==i.state&&i.remove()}},init:function(i,n){if(n.desktop){if(0!==(o=t.desktop.checkPermission()))return void(n.fallback||(i.options.auto_display=!1));this.genNotice(i,n)}},update:function(i,t,n){0!==o&&t.fallback||!t.desktop||this.genNotice(i,t)},beforeOpen:function(i,t){0!==o&&t.fallback||!t.desktop||i.elem.css({left:"-10000px"}).removeClass("ui-pnotify-in")},afterOpen:function(i,t){0!==o&&t.fallback||!t.desktop||(i.elem.css({left:"-10000px"}).removeClass("ui-pnotify-in"),"show"in i.desktop&&i.desktop.show())},beforeClose:function(i,t){0!==o&&t.fallback||!t.desktop||i.elem.css({left:"-10000px"}).removeClass("ui-pnotify-in")},afterClose:function(i,t){0!==o&&t.fallback||!t.desktop||(i.elem.css({left:"-10000px"}).removeClass("ui-pnotify-in"),"close"in i.desktop&&i.desktop.close())}},t.desktop={permission:function(){"undefined"!=typeof Notification&&"requestPermission"in Notification?Notification.requestPermission():"webkitNotifications"in window&&window.webkitNotifications.requestPermission()},checkPermission:function(){return"undefined"!=typeof Notification&&"permission"in Notification?"granted"===Notification.permission?0:1:"webkitNotifications"in window&&0==window.webkitNotifications.checkPermission()?0:1}},o=t.desktop.checkPermission(),t});
//# sourceMappingURL=pnotify.desktop.js.map
// Mobile
!function(i,o){"function"==typeof define&&define.amd?define("pnotify.mobile",["jquery","pnotify"],o):"object"==typeof exports&&"undefined"!=typeof module?module.exports=o(require("jquery"),require("./pnotify")):o(i.jQuery,i.PNotify)}("undefined"!=typeof window?window:this,function(i,o){return o.prototype.options.mobile={swipe_dismiss:!0,styling:!0},o.prototype.modules.mobile={init:function(i,o){var t=this,e=null,n=null,s=null;this.swipe_dismiss=o.swipe_dismiss,this.doMobileStyling(i,o),i.elem.on({touchstart:function(o){t.swipe_dismiss&&(e=o.originalEvent.touches[0].screenX,s=i.elem.width(),i.container.css("left","0"))},touchmove:function(o){if(e&&t.swipe_dismiss){var a=o.originalEvent.touches[0].screenX;n=a-e;var c=(1-Math.abs(n)/s)*i.options.opacity;i.elem.css("opacity",c),i.container.css("left",n)}},touchend:function(){if(e&&t.swipe_dismiss){if(Math.abs(n)>40){var o=n<0?-2*s:2*s;i.elem.animate({opacity:0},100),i.container.animate({left:o},100),i.remove()}else i.elem.animate({opacity:i.options.opacity},100),i.container.animate({left:0},100);e=null,n=null,s=null}},touchcancel:function(){e&&t.swipe_dismiss&&(i.elem.animate({opacity:i.options.opacity},100),i.container.animate({left:0},100),e=null,n=null,s=null)}})},update:function(i,o){this.swipe_dismiss=o.swipe_dismiss,this.doMobileStyling(i,o)},doMobileStyling:function(o,t){t.styling?(o.elem.addClass("ui-pnotify-mobile-able"),i(window).width()<=480?(o.options.stack.mobileOrigSpacing1||(o.options.stack.mobileOrigSpacing1=o.options.stack.spacing1,o.options.stack.mobileOrigSpacing2=o.options.stack.spacing2),o.options.stack.spacing1=0,o.options.stack.spacing2=0):(o.options.stack.mobileOrigSpacing1||o.options.stack.mobileOrigSpacing2)&&(o.options.stack.spacing1=o.options.stack.mobileOrigSpacing1,delete o.options.stack.mobileOrigSpacing1,o.options.stack.spacing2=o.options.stack.mobileOrigSpacing2,delete o.options.stack.mobileOrigSpacing2)):(o.elem.removeClass("ui-pnotify-mobile-able"),o.options.stack.mobileOrigSpacing1&&(o.options.stack.spacing1=o.options.stack.mobileOrigSpacing1,delete o.options.stack.mobileOrigSpacing1),o.options.stack.mobileOrigSpacing2&&(o.options.stack.spacing2=o.options.stack.mobileOrigSpacing2,delete o.options.stack.mobileOrigSpacing2))}},o});
//# sourceMappingURL=pnotify.mobile.js.map

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
            if (models[j].hasAttribute("hidden")) {
                models[j].removeAttribute("hidden");
            } 
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
};

document.addEventListener("DOMContentLoaded", init, false);

//# sourceMappingURL=layoutsimple.bundle.js.map
