"use strict";var countDownInterval;function createAcountSuccess(){Site.AddClass("[data-content]","hide"),Site.RemoveClass("[data-thankyou]","hide"),intCountDown()}function intCountDown(){var n=$("._idCountDown").FlipClock(3,{clockFace:"Counter"});setTimeout(function(){countDownInterval=setInterval(function(){n.decrement(),0===n.time.time&&(clearInterval(countDownInterval),window.location=window.location.origin)},1e3)})}document.addEventListener("DOMContentLoaded",function(){});