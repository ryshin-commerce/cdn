/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * https://codepen.io/karpovsystems/pen/fFHxK
 * * * * * * * * * * * * * * * * */

class Pagination {    
    // --------------------
    // Utility
    // --------------------

    // converting initialize data
    Extend(data) {
        data = data || {};
        this.code = "";
        this.size = data.size ? parseInt(data.size) : 0;
        this.page = data.page ? parseInt(data.page) : 0;
        this.step = data.step ? parseInt(data.step) : 0;
        this.tagName = data.tagName || 'a';
        this.attribute = data.attribute || '';
        this.hrefToken = data.hrefToken || '';
        this.showValue = !!data.showValue || false;
        this.submitFromAttributes = data.form != null
            ? ('form="' + data.form + '" type=submit name="PageNumber"')
            : "";
        this.hover = data.hover || '';
        this.itemClassName = '';
        if (!!data.hover) {
            this.itemClassName += " class='hover-tooltip' ";
        }
        this.callBack = data.callBack;
    }

    // add pages by number (from [s] to [f])
    Add(s, f) {
        for (let i = s; i < f; i++) {
            const url = this.hrefToken ? 'href="' + this.hrefToken.replace("{PAGE}", i) + '"' : "";
            const value = this.showValue ? 'value="' + i + '"' : "";
            const hoverElement = this.hover
                ? "<span class='tooltip top'>" + this.hover.replace("{PAGE}", i) + "</span>" : "";
            this.code += '<li' + this.itemClassName + '><' + this.tagName + ' ' + this.submitFromAttributes + ' ' + url + ' ' + value + ' ' + this.attribute + 'data-value=' + i + ' >' + i + '</' + this.tagName + '>' + hoverElement + '</li>';
        }
    };

    // add last page with separator
    Last() {
        const url = this.hrefToken ? 'href="' + this.hrefToken.replace("{PAGE}", (this.size > 1 ? this.size : 1)) + '"' : "";
        const value = this.showValue ? 'value="' + (this.size > 1 ? this.size : 1) + '"' : "";
        const hoverElement = this.hover
            ? "<span class='tooltip top'>" + this.hover.replace("{PAGE}", (this.size > 1 ? this.size : 1)) + "</span>" : "";
        this.code += '<i>...</i><li data-last ' + this.itemClassName + ' ><' + this.tagName + ' ' + this.submitFromAttributes + ' ' + url + ' ' + value + ' ' + this.attribute + 'data-value=' + this.size + '>' + this.size + '</' + this.tagName + '>' + hoverElement + '</li>';
    };

    // add first page with separator
    First() {
        const url = this.hrefToken ? 'href="' + this.hrefToken.replace("{PAGE}", 1) + '"' : "";
        const value = this.showValue ? 'value="' + 1 + '"' : "";
        const hoverElement = this.hover
            ? "<span class='tooltip top'>" + this.hover.replace("{PAGE}", 1) + "</span>" : "";
        this.code += '<li data-first ' + this.itemClassName + '><' + this.tagName + ' ' + this.submitFromAttributes + ' ' + url + ' ' + value + ' ' + this.attribute + ' data-value=1>1</' + this.tagName + '>' + hoverElement + '</li><i>...</i>';
    };



    // --------------------
    // Handlers
    // --------------------

    // change page
    Click(pageNumber) {
        this.page = +pageNumber;
        this.Start();

        if (!!this.callBack) {
            var f = new Function("pageNumber", this.callBack);
            f(--this.page);
        }
    };

    // previous page
    Prev() {
        this.page--;
        if (this.page < 1) {
            this.page = 1;
        }
        this.Start();
    };

    // next page
    Next(){
        this.page++;
        if (this.page > this.size) {
            this.page = this.size;
        }
        this.Start();
    };



    // --------------------
    // Script
    // --------------------

    // binding pages
    Bind() {
        var that = this;
        const a = this.e.getElementsByTagName(this.tagName);
        for (let i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === this.page) {
                a[i].parentElement.className = 'current';
            }

            if (!this.submitFromAttributes) {
           
                a[i].addEventListener('click', function () {                    
                    that.Click(this.value);
                }, false);
            }

        }
    };

    // write pagination
    Finish() {
        this.e.innerHTML = this.code;
        this.code = '';
        this.Bind();
    };

    // find pagination type
    Start() {
        if (this.size < this.step * 2 + 6) {
            this.Add(1, this.size + 1);
        }
        else if (this.page < this.step * 2 + 1) {
            this.Add(1, this.step * 2 + 4);
            this.Last();
        }
        else if (this.page > this.size - this.step * 2) {
            this.First();
            this.Add(this.size - this.step * 2 - 2, this.size + 1);
        }
        else {
            this.First();
            this.Add(this.page - this.step, this.page + this.step + 1);
            this.Last();
        }
        this.Finish();
    };



    // --------------------
    // Initialization
    // --------------------

    // binding buttons
    Buttons(e) {
        var that = this;
        const nav = e.getElementsByTagName(this.tagName);
        nav[0].addEventListener('click', function () { that.Prev(); } , false);
        nav[1].addEventListener('click', function () { that.Next(); }, false);

    };

    // create skeleton
    Create(e) {
        const urlPageStart = this.hrefToken ? 'href="' + this.hrefToken.replace("{PAGE}", (this.page > 1 ? this.page - 1 : 1)) + '"' : "";
        const urlPageEnd = this.hrefToken ? 'href="' + this.hrefToken.replace("{PAGE}", (this.size > this.page ? this.page + 1 : this.size)) + '"' : "";
        const valueStart = this.showValue ? 'value="' + (this.page > 1 ? this.page - 1 : 1) + '"' : "";
        const valueEnd = this.showValue ? 'value="' + (this.page > 1 ? this.page - 1 : 1) + '"' : "";
        //const hoverElementStart = this.hover
        //    ? "<span class='tooltip top'>" + this.hover.replace("{PAGE}", (this.page > 1 ? this.page - 1 : 1)) + "</span>" : "";
        //const hoverElementEnd = this.hover
        //    ? "<span class='tooltip top'>" + this.hover.replace("{PAGE}", (this.size > this.page ? this.page + 1 : this.size)) + "</span>" : "";
        const html = [
            '<li' + this.itemClassName + '><' + this.tagName + ' class="pre" ' + this.submitFromAttributes + ' ' + valueStart + ' ' + this.attribute + ' ' + urlPageStart + ' data-value=' + (this.page > 1 ? this.page : 1) + ' >&#9668;</' + this.tagName + '></li>', // previous button
            '<span></span>',  // pagination container
            '<li' + this.itemClassName + '><' + this.tagName + ' class="next" ' + this.submitFromAttributes + ' ' + valueEnd + ' ' + this.attribute + ' ' + urlPageEnd + ' data-value=' + (this.size > this.page ? this.page + 1 : this.size) + ' >&#9658;</' + this.tagName + '></li>'  // next button
        ];

        e.innerHTML = html.join('');
        this.e = e.getElementsByTagName('span')[0];
        this.Buttons(e);
    };

    // init
    Init(e, data) {
        this.Extend(data);
        this.Create(e);
        this.Start();
    };
    Run(querySelector) {
        const pagingContainers = !!querySelector ? document.querySelector(querySelector).getElementsByClassName('_p-gination') : document.getElementsByClassName('_p-gination');

        for (let i = 0; i < pagingContainers.length; i++) {         
            const ele = pagingContainers[i];
            this.Init(ele, ele.dataset);
        }
    }
};



/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */


//document.addEventListener('DOMContentLoaded', this.Run(), false);


