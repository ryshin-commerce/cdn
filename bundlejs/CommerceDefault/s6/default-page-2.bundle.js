"use strict";function init(){}function ratingCompleteCallBack(){}function innitFileUpload(){var t=document.getElementById("inputRatingFormFile"),e=t.dataset.curentPathFiles&&""!==t.dataset.curentPathFiles?[t.dataset.curentPathFiles]:null,a=t.dataset.curentShowingImages&&""!==t.dataset.curentShowingImages?[t.dataset.curentShowingImages]:null,n=t.dataset.maxFile&&""!==t.dataset.maxFile?+t.dataset.maxFile:3,i=t.dataset.maxFile&&""!==t.dataset.maxSize?+t.dataset.maxSize:5;(new FileUpload).Init(null,e,a,"#inputRatingFormFile","#newReviewContainer","#newReviewContainer","#frmProductRating",n,console.log("change"),!0,"RatingFormFile",i)}document.addEventListener("DOMContentLoaded",function(){init()});