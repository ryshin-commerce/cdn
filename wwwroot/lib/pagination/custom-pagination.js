/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * https://codepen.io/karpovsystems/pen/fFHxK
 * * * * * * * * * * * * * * * * */

var Pagination = {

    code: '',

    // --------------------
    // Utility
    // --------------------

    // converting initialize data
    Extend: function (data) {
        data = data || {};
        Pagination.size = data.size ? parseInt(data.size) : 0;
        Pagination.page = data.page ? parseInt(data.page) : 0;
        Pagination.step = data.step ? parseInt(data.step) : 0;
        Pagination.tagName = data.tagName || 'a';
        Pagination.attribute = data.attribute || '';
        Pagination.hrefToken = data.hrefToken || '';
        Pagination.showValue = !!data.showValue || false;
        Pagination.submitFromAttributes = data.form != null
            ? ('form="' + data.form + '" type=submit name="PageNumber"')
            : "";
        Pagination.hover = data.hover || '';
        Pagination.itemClassName = '';
        if (!!data.hover) {
            Pagination.itemClassName += " class='hover-tooltip' ";
        }
    },

    // add pages by number (from [s] to [f])
    Add: function (s, f) {
        for (let i = s; i < f; i++) {
            const url = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", i) + '"' : "";
            const value = Pagination.showValue ? 'value="' + i + '"' : "";
            const hoverElement = Pagination.hover
                ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", i) + "</span>" : "";
            Pagination.code += '<li' + Pagination.itemClassName + '><' + Pagination.tagName + ' ' + Pagination.submitFromAttributes + ' ' + url + ' ' + value + ' ' + Pagination.attribute + 'data-value=' + i + ' >' + i + '</' + Pagination.tagName + '>' + hoverElement +'</li>';
        }
    },

    // add last page with separator
    Last: function () {
        const url = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", (Pagination.size > 1 ? Pagination.size : 1)) + '"' : "";
        const value = Pagination.showValue ? 'value="' + (Pagination.size > 1 ? Pagination.size : 1) + '"' : "";
        const hoverElement = Pagination.hover
            ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", (Pagination.size > 1 ? Pagination.size : 1)) + "</span>" : "";
        Pagination.code += '<i>...</i><li data-last ' + Pagination.itemClassName + ' ><' + Pagination.tagName + ' ' + Pagination.submitFromAttributes + ' ' + url + ' ' + value + ' ' + Pagination.attribute + 'data-value=' + Pagination.size + '>' + Pagination.size + '</' + Pagination.tagName + '>' + hoverElement +'</li>';
    },

    // add first page with separator
    First: function () {
        const url = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", 1) + '"' : "";
        const value = Pagination.showValue ? 'value="' + 1 + '"' : "";
        const hoverElement = Pagination.hover
            ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", 1) + "</span>" : "";
        Pagination.code += '<li data-first ' + Pagination.itemClassName + '><' + Pagination.tagName + ' ' + Pagination.submitFromAttributes + ' ' + url + ' ' + value + ' ' + Pagination.attribute + ' data-value=1>1</' + Pagination.tagName + '>' + hoverElement +'</li><i>...</i>';
    },



    // --------------------
    // Handlers
    // --------------------

    // change page
    Click: function () {
        Pagination.page = +this.innerHTML;
        Pagination.Start();
    },

    // previous page
    Prev: function () {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        Pagination.Start();
    },

    // next page
    Next: function (increNumber=1) {
        Pagination.page += increNumber;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        Pagination.Start();
    },



    // --------------------
    // Script
    // --------------------

    // binding pages
    Bind: function () {
        const a = Pagination.e.getElementsByTagName(Pagination.tagName);
        for (let i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === Pagination.page) {
                a[i].parentElement.className = 'current';
            }

            if (!Pagination.submitFromAttributes) {
                a[i].addEventListener('click', Pagination.Click, false);
            }

        }
    },

    // write pagination
    Finish: function () {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },

    // find pagination type
    Start: function () {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        }
        else if (Pagination.page < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        }
        else if (Pagination.page > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        }
        else {
            Pagination.First();
            Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
            Pagination.Last();
        }
        Pagination.Finish();
    },



    // --------------------
    // Initialization
    // --------------------

    // binding buttons
    Buttons: function (e) {
        const nav = e.getElementsByTagName(Pagination.tagName);
        nav[0].addEventListener('click', Pagination.Prev, false);
        nav[1].addEventListener('click', Pagination.Next, false);
    },

    // create skeleton
    Create: function (e) {
        const urlPageStart = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", (Pagination.page > 1 ? Pagination.page - 1 : 1)) + '"' : "";
        const urlPageEnd = Pagination.hrefToken ? 'href="' + Pagination.hrefToken.replace("{PAGE}", (Pagination.size > Pagination.page ? Pagination.page + 1 : Pagination.size)) + '"' : "";
        const valueStart = Pagination.showValue ? 'value="' + (Pagination.page > 1 ? Pagination.page - 1 : 1) + '"' : "";
        const valueEnd = Pagination.showValue ? 'value="' + (Pagination.page > 1 ? Pagination.page - 1 : 1) + '"' : "";
        //const hoverElementStart = Pagination.hover
        //    ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", (Pagination.page > 1 ? Pagination.page - 1 : 1)) + "</span>" : "";
        //const hoverElementEnd = Pagination.hover
        //    ? "<span class='tooltip top'>" + Pagination.hover.replace("{PAGE}", (Pagination.size > Pagination.page ? Pagination.page + 1 : Pagination.size)) + "</span>" : "";
        const html = [
            '<li' + Pagination.itemClassName + '><' + Pagination.tagName + ' class="pre" ' + Pagination.submitFromAttributes + ' ' + valueStart + ' ' + Pagination.attribute + ' ' + urlPageStart + ' data-value=' + (Pagination.page > 1 ? Pagination.page : 1) + ' >&#9668;</' + Pagination.tagName + '></li>', // previous button
            '<span></span>',  // pagination container
            '<li' + Pagination.itemClassName + '><' + Pagination.tagName + ' class="next" ' + Pagination.submitFromAttributes + ' ' + valueEnd + ' ' + Pagination.attribute + ' ' + urlPageEnd + ' data-value=' + (Pagination.size > Pagination.page ? Pagination.page + 1 : Pagination.size) + ' >&#9658;</' + Pagination.tagName + '></li>'  // next button
        ];

        e.innerHTML = html.join('');
        Pagination.e = e.getElementsByTagName('span')[0];
        Pagination.Buttons(e);
    },

    // init
    Init: function (e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    },
    Run: function () {
        const pagingContainers = document.getElementsByClassName('_p-gination');
        for (let i = 0; i < pagingContainers.length; i++) {
            const ele = pagingContainers[i];
            Pagination.Init(ele, ele.dataset);
        }
    }
};



/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */


document.addEventListener('DOMContentLoaded', Pagination.Run(), false);


