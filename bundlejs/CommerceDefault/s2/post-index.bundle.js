"use strict";var btnSearchProductName;function processAnonymousUser(){for(var t=document.querySelectorAll("[rating-id] canvas"),e=0;e<t.length;e++){var n=t[e],i=n.dataset.userName.split(" "),a=2<i.length?i[0].charAt(0).toUpperCase()+i[1].charAt(0).toUpperCase():i[0].charAt(0).toUpperCase(),o=n.getContext("2d"),l=n.width,d=n.height;window.devicePixelRatio&&(n.setAttribute("width",l*window.devicePixelRatio),n.setAttribute("height",d*window.devicePixelRatio),n.style.width=l+"px",n.style.height=d+"px",o.scale(window.devicePixelRatio,window.devicePixelRatio)),o.fillStyle=stringToHslColor(a,30,80),o.fillRect(0,0,n.width,n.height),o.font=d/2+"px Arial",o.textAlign="center",o.fillStyle="#FFF",o.fillText(a,l/2,d/1.5)}}function stringToHslColor(t,e,n){for(var i=0,a=0;a<t.length;a++)i=t.charCodeAt(a)+((i<<5)-i);return"hsl("+i%360+", "+e+"%, "+n+"%)"}function initPostIndex(){}function lazyLoadRating(){document.getElementById("btnReloadRatings").click()}function innitFileUpload(){var t=document.getElementById("inputRatingFormFile"),e=t.dataset.curentPathFiles&&""!==t.dataset.curentPathFiles?[t.dataset.curentPathFiles]:null,n=t.dataset.curentShowingImages&&""!==t.dataset.curentShowingImages?[t.dataset.curentShowingImages]:null,i=t.dataset.maxFile&&""!==t.dataset.maxFile?+t.dataset.maxFile:3,a=t.dataset.maxFile&&""!==t.dataset.maxSize?+t.dataset.maxSize:5;(new FileUpload).Init(null,e,n,"#inputRatingFormFile","#newReviewContainer","#newReviewContainer","#frmProductRating",i,console.log("change"),!0,"RatingFormFile",a)}function clearform(){$("#frmProductRating")[0].reset();var t=document.getElementById("newReviewContainer");t&&(t.innerHTML="")}document.addEventListener("DOMContentLoaded",function(){}),document.addEventListener("DOMContentLoaded",function(){initPostIndex(),lazyLoadRating(),innitFileUpload()});