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