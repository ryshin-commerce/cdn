var btnSearchProductName;

document.addEventListener("DOMContentLoaded",
    function () {
    });

function submitProductWidgetAction(selector) {
    var loadActionForm = document.querySelector(selector + " [data-widget-waiting]");

    if (!!loadActionForm) {
        var btn = loadActionForm.querySelector("[data-btn-get-widget-action]");
        btn.click();
        submitProductWidgetAction(selector);
    }
};

function checkTimeCountDown(selector) {
    var countDownElement = document.querySelector(selector + " [data-flash-deal-count-down]");

    if (!countDownElement || !countDownElement.hasAttribute("data-flash-deal-count-down")) {
        return;
    }

    var countDownValue = countDownElement.dataset.flashDealCountDown;
    var days = Math.floor(countDownValue / 86400);
    var ticks = countDownValue % 86400;
    var counter = setInterval(function timerDown() {
            ticks = ticks - 1;
            if (ticks === -1) {
                clearInterval(counter);
                return;
            }

            var seconds = ticks % 60,
                minutes = Math.floor(ticks / 60),
                hours = Math.floor(minutes / 60);
            minutes %= 60;
            hours %= 60;

            if (minutes < 10) {

                minutes = '0' + minutes;
            }

            if (hours < 10) {

                hours = '0' + hours;
            }

            if (seconds < 10) {

                seconds = '0' + seconds;
            }

            countDownElement.innerHTML = (days > 0 ? days + " days " : "") + hours + ":" + minutes + ":" + seconds;
        },
        1000);
}