"use strict";

var countDownInterval;

document.addEventListener("DOMContentLoaded",
    function () {
       
    });

function createAcountSuccess() {
    Site.AddClass("[data-content]", "hide");
    Site.RemoveClass("[data-thankyou]", "hide");
    intCountDown();
}

function intCountDown() {
    var countNumber = 3;
    var clock = $('._idCountDown').FlipClock(countNumber, {
        clockFace: 'Counter'
    });

    setTimeout(function () {
        countDownInterval = setInterval(function () {
            clock.decrement();
            if (clock.time.time === 0) {
                clearInterval(countDownInterval);
                window.location = window.location.origin;
            }
           
        }, 1000);
    });
}