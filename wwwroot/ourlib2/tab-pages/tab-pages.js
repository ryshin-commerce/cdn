/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

function TabPages() {
    // converting initialize data
    this.Extend = function (navElement, tabs, tabContains) {
        var selectTabNumber = navElement.dataset.activeTabNumber;
        this.SelectedTabNumber = +selectTabNumber || -1;
        this.NavElement = navElement;
        this.Tabs = tabs;
        this.TabContains = tabContains;
        this.Process();
    };

    this.Process = function () {
        var self = this;
        for (var i = 0; i < this.Tabs.length; i++) {
            this.Tabs[i].addEventListener("click",
                function (eve) {
                    if (!!eve.currentTarget.dataset.tabUrl) {
                        history.replaceState(null, null, eve.currentTarget.dataset.tabUrl);
                    }
                    self.SelectedTabNumber = +eve.currentTarget.dataset.tab || 0;
                    self.NavElement.dataset.activeTabNumber = self.SelectedTabNumber;

                    Site.BeLazyRevalidate();
                    if (!!eve.currentTarget.dataset.callback) {
                        var tabContentElement = null;
                        for (var j = 0; j < self.TabContains.length; j++) {
                            if (self.TabContains[j].dataset.tabContent === eve.currentTarget.dataset.tab) {
                                tabContentElement = self.TabContains[j];
                                break;
                            }
                        }
                        Site.GetFunction(eve.currentTarget.dataset.callback, ["tabNumber", "tabContainerElement"]).apply(eve.currentTarget, [self.SelectedTabNumber, tabContentElement]);
                    }
                });
        }
    };

    // init
    this.Init = function (selector) {
        var navElement = document.querySelector(selector);

        if (!navElement) {
            return;
        }

        var tabs = navElement.parentNode.querySelectorAll("[data-tab]");
        var tabContents = navElement.parentNode.querySelectorAll("[data-tab-content]");

        this.Extend(navElement, tabs, tabContents);
    };
};/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */
