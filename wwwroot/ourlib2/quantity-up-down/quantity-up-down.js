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

