"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,a){return t&&_defineProperties(e.prototype,t),a&&_defineProperties(e,a),e}var galleryThumbs,galleryTop,btnSearchProductName,imageCaptchaQuestion,fileUploadRatingQuestion,imputDocumentFileQuestion,inputUserNameQuestion,inputEmailQuestion,btnRemoveAnwerFor,spanUserName,inputParentId,textArea,listQuantities,chkOutOfStock,txtQuantity,attribute1Items,attribute2Items,productClassificationId,dataPrice,newestPostsContainer,activeProductClass,subscribeButton,discountPercentEle,flashSaleContainer,dataCountEle,dataProcessBarEle,dataDelPrice,idWholesaleInfo,Pagination=function(){function e(){_classCallCheck(this,e)}return _createClass(e,[{key:"Extend",value:function(e){e=e||{},this.code="",this.size=e.size?parseInt(e.size):0,this.page=e.page?parseInt(e.page):0,this.step=e.step?parseInt(e.step):0,this.tagName=e.tagName||"a",this.attribute=e.attribute||"",this.hrefToken=e.hrefToken||"",this.showValue=!!e.showValue||!1,this.submitFromAttributes=null!=e.form?'form="'+e.form+'" type=submit name="PageNumber"':"",this.hover=e.hover||"",this.itemClassName="",e.hover&&(this.itemClassName+=" class='hover-tooltip' "),this.callBack=e.callBack}},{key:"Add",value:function(e,t){for(var a=e;a<t;a++){var i=this.hrefToken?'href="'+this.hrefToken.replace("{PAGE}",a)+'"':"",n=this.showValue?'value="'+a+'"':"",r=this.hover?"<span class='tooltip top'>"+this.hover.replace("{PAGE}",a)+"</span>":"";this.code+="<li"+this.itemClassName+"><"+this.tagName+" "+this.submitFromAttributes+" "+i+" "+n+" "+this.attribute+"data-value="+a+" >"+a+"</"+this.tagName+">"+r+"</li>"}}},{key:"Last",value:function(){var e=this.hrefToken?'href="'+this.hrefToken.replace("{PAGE}",1<this.size?this.size:1)+'"':"",t=this.showValue?'value="'+(1<this.size?this.size:1)+'"':"",a=this.hover?"<span class='tooltip top'>"+this.hover.replace("{PAGE}",1<this.size?this.size:1)+"</span>":"";this.code+="<i>...</i><li data-last "+this.itemClassName+" ><"+this.tagName+" "+this.submitFromAttributes+" "+e+" "+t+" "+this.attribute+"data-value="+this.size+">"+this.size+"</"+this.tagName+">"+a+"</li>"}},{key:"First",value:function(){var e=this.hrefToken?'href="'+this.hrefToken.replace("{PAGE}",1)+'"':"",t=this.showValue?'value="1"':"",a=this.hover?"<span class='tooltip top'>"+this.hover.replace("{PAGE}",1)+"</span>":"";this.code+="<li data-first "+this.itemClassName+"><"+this.tagName+" "+this.submitFromAttributes+" "+e+" "+t+" "+this.attribute+" data-value=1>1</"+this.tagName+">"+a+"</li><i>...</i>"}},{key:"Click",value:function(e){this.page=+e,this.Start(),this.callBack&&new Function("pageNumber",this.callBack)(--this.page)}},{key:"Prev",value:function(){this.page--,this.page<1&&(this.page=1),this.Start()}},{key:"Next",value:function(){this.page++,this.page>this.size&&(this.page=this.size),this.Start()}},{key:"Bind",value:function(){for(var e=this,t=this.e.getElementsByTagName(this.tagName),a=0;a<t.length;a++)+t[a].innerHTML===this.page&&(t[a].parentElement.className="current"),this.submitFromAttributes||t[a].addEventListener("click",function(){e.Click(this.value)},!1)}},{key:"Finish",value:function(){this.e.innerHTML=this.code,this.code="",this.Bind()}},{key:"Start",value:function(){this.size<2*this.step+6?this.Add(1,this.size+1):this.page<2*this.step+1?(this.Add(1,2*this.step+4),this.Last()):this.page>this.size-2*this.step?(this.First(),this.Add(this.size-2*this.step-2,this.size+1)):(this.First(),this.Add(this.page-this.step,this.page+this.step+1),this.Last()),this.Finish()}},{key:"Buttons",value:function(e){var t=this,e=e.getElementsByTagName(this.tagName);e[0].addEventListener("click",function(){t.Prev()},!1),e[1].addEventListener("click",function(){t.Next()},!1)}},{key:"Create",value:function(e){var t=this.hrefToken?'href="'+this.hrefToken.replace("{PAGE}",1<this.page?this.page-1:1)+'"':"",a=this.hrefToken?'href="'+this.hrefToken.replace("{PAGE}",this.size>this.page?this.page+1:this.size)+'"':"",i=this.showValue?'value="'+(1<this.page?this.page-1:1)+'"':"",n=this.showValue?'value="'+(1<this.page?this.page-1:1)+'"':"",a=["<li"+this.itemClassName+"><"+this.tagName+' class="pre" '+this.submitFromAttributes+" "+i+" "+this.attribute+" "+t+" data-value="+(1<this.page?this.page:1)+" >&#9668;</"+this.tagName+"></li>","<span></span>","<li"+this.itemClassName+"><"+this.tagName+' class="next" '+this.submitFromAttributes+" "+n+" "+this.attribute+" "+a+" data-value="+(this.size>this.page?this.page+1:this.size)+" >&#9658;</"+this.tagName+"></li>"];e.innerHTML=a.join(""),this.e=e.getElementsByTagName("span")[0],this.Buttons(e)}},{key:"Init",value:function(e,t){this.Extend(t),this.Create(e),this.Start()}},{key:"Run",value:function(e){for(var t=(e?document.querySelector(e):document).getElementsByClassName("_p-gination"),a=0;a<t.length;a++){var i=t[a];this.Init(i,i.dataset)}}}]),e}();function FileUpload(){this.InputElement=null,this.PreviewBoxElement=null,this.CurentImageBox=null,this.Form=null,this.MaxFile=null,this.StoredFiles=[],this.CurentFiles=[],this.CurentPreviewImages=[],this.Extend=function(e,t,a,i,n,r,s,o,l,c,u,d){this.InputElement=i,this.AcceptExtention=i.accept.split(","),this.PreviewBoxElement=r,this.CurentImageBox=n,this.Form=s,this.UniqueControlName=u?"CurentFilePaths":"NewFiles"+u,this.MaxFile=o||2,this.MaxFileSize=d||5242880,this.InputChangeCallBack=void 0!==l?l:null,this.InputElement.addEventListener("change",this.InputChange),(this.InputElement.fileUpload=this).FileReader=new FileReader,this.IsCreateInputName=c||!1,this.HostCdn=e||"",this.CurentFiles=t||[],this.CurentPreviewImages=a||[],this.Process()},this.Process=function(){if(this.CurentImageBox)for(var t=this,e=0;e<this.CurentFiles.length;e++){var a=this.CurentFiles[e],i=this.CurentPreviewImages[e],n=document.createElement("div");n.className="col-3 gutter-10 _p-item text-center";var r=document.createElement("figure");r.className="_max-height-200 relative hover-children-show";var s=document.createElement("button");s.className="absolute hide tablet-show -border width-100 height-100 _fill-silver-opacity text-strong",s.innerText="CLICK ĐỂ XÓA",s.type="button",s.dataset.file=a,s.dataset.notClose="I",s.addEventListener("click",function(e){t.RemoveCurentFile(e,t.InputElement)});var o,l,c=a.substring(a.lastIndexOf("/")+1),u=c.substring(c.indexOf(".")+1);("."+u).match(".jpg,.png,.svg,.gif,.jfif,.webp,.csv".replace(new RegExp(",","g"),"|"))?o="<img class='_max-width-100-percent'   onerror='this.src=\"/images/shared/no-image.svg\"'   src='"+t.HostCdn+"/"+i+"' alt='"+c+"' data-file='"+c+"' /><figcaption class='padding-5 text-center _text-ellipsis'>"+c+"</figcaption>":(o="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' version='1'><path d='M128 0c-18 0-32 14-32 32v448c0 18 14 32 32 32h320c18 0 32-14 32-32V128L352 0H128z' fill='#e2e5e7'/><path d='M384 128h96L352 0v96c0 18 14 32 32 32z' fill='#b0b7bd'/><path fill='#cad1d8' d='M480 224l-96-96h96z'/><path d='M416 416c0 9-7 16-16 16H48c-9 0-16-7-16-16V256c0-9 7-16 16-16h352c9 0 16 7 16 16v160z' fill='#f15642'/><path d='M400 432H96v16h304c9 0 16-7 16-16v-16c0 9-7 16-16 16z' fill='#cad1d8'/><text y='375' x='212' style='line-height:1.25;text-align:center' font-weight='400' font-size='147' font-family='sans-serif' letter-spacing='0' word-spacing='0' text-anchor='middle' stroke-width='3'><tspan style='line-height:1.25;-inkscape-font-specification:'monospace Bold';text-align:center' y='375' x='212' font-weight='700' font-family='monospace' fill='#fff'>"+u+"</tspan></text></svg>",(l=document.createElement("div")).innerHTML="<div class='row text-center _text-ellipsis'><a target='_blank' href='"+t.HostCdn+"/"+i+"'>"+c+"</a></div>"),t.IsCreateInputName&&(o+="<input type='text' class='_hidden'    name='"+t.UniqueControlName+"' value="+a+(t.Form?" form='"+t.Form.id+"'":"")+"></input>"),r.innerHTML=o,r.insertBefore(s,r.childNodes[0]),n.appendChild(r),l&&n.appendChild(l),t.CurentImageBox.appendChild(n)}},this.InputChange=function(e){var r=e.target.fileUpload,e=e.target.files,t=Array.prototype.slice.call(e);r.PreviewBoxElement.innerHTML="",r.StoredFiles=[];for(var a=0;a<t.length;a++){var i,n=t[a];n.size>r.MaxFileSize?Site.NotifyFormFailed("Lỗi","File không được lớn hơn "+r.MaxFileSize/1048576+" mb"):(r.StoredFiles.push(n),r.PreviewBoxElement===r.CurentImageBox&&(r.CurentFiles=[],r.CurentImageBox.innerHTML=""),r.StoredFiles.length+r.CurentFiles.length<=r.MaxFile&&((i=new FileReader).onload=function(e){var t=event.target,a=document.createElement("div");a.className="gutter-10 _p-item";var i=document.createElement("figure");i.className="_max-height-200 relative hover-children-show";var n=document.createElement("button");n.className="absolute hide -border width-100 height-100 _fill-silver-opacity text-strong",n.type="button",n.innerText="CLICK ĐỂ XÓA",n.dataset.file=t.name,n.dataset.notClose="I",n.addEventListener("click",function(e){r.RemoveFile(e,r.InputElement)}),e=t.fileType.match("image.*")?"<img class='width-100 _max-width-100-percent' src='"+e.target.result+"' alt='"+t.name+"' data-file='"+t.name+"' /><figcaption class='padding-5 text-center _text-ellipsis'>("+t.size%1e3+" kb) "+t.name+"</figcaption>":"<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 512 512' version='1'><path d='M128 0c-18 0-32 14-32 32v448c0 18 14 32 32 32h320c18 0 32-14 32-32V128L352 0H128z' fill='#e2e5e7'/><path d='M384 128h96L352 0v96c0 18 14 32 32 32z' fill='#b0b7bd'/><path fill='#cad1d8' d='M480 224l-96-96h96z'/><path d='M416 416c0 9-7 16-16 16H48c-9 0-16-7-16-16V256c0-9 7-16 16-16h352c9 0 16 7 16 16v160z' fill='#f15642'/><path d='M400 432H96v16h304c9 0 16-7 16-16v-16c0 9-7 16-16 16z' fill='#cad1d8'/><text y='375' x='212' style='line-height:1.25;text-align:center' font-weight='400' font-size='147' font-family='sans-serif' letter-spacing='0' word-spacing='0' text-anchor='middle' stroke-width='3'><tspan style='line-height:1.25;-inkscape-font-specification:'monospace Bold';text-align:center' y='375' x='212' font-weight='700' font-family='monospace' fill='#fff'>"+t.name.substring(t.name.indexOf(".")+1)+"</tspan></text></svg><figcaption class='padding-5 text-center _text-ellipsis'>("+t.size%1e3+" kb) "+t.name+"</figcaption>",r.IsCreateInputName&&(e+="<input type='text' class='_hidden' name='"+r.UniqueControlName+"[]' value="+t.name+(r.Form?" form='"+r.Form.id+"'":"")+"></input>"),i.innerHTML=e,i.insertBefore(n,i.childNodes[0]),a.appendChild(i),r.PreviewBoxElement.appendChild(a)},i.size=n.size,i.fileType=n.type,i.name=n.name,i.readAsDataURL(n)))}r.InputChangeCallBack&&r.InputChangeCallBack(r.StoredFiles)},this.RemoveCurentFile=function(e){for(var t=e.target.dataset.file,a=0;a<this.CurentFiles.length;a++)if(this.CurentFiles[a]===t){this.CurentFiles.splice(a,1);break}Site.FindParent(e.target,"_p-item").remove()},this.RemoveFile=function(e,t){for(var a=e.target.dataset.file,i=0;i<this.StoredFiles.length;i++)if(this.StoredFiles[i].name===a){this.StoredFiles.splice(i,1);break}Site.FindParent(e.target,"_p-item").remove(),Site.ClearInputFile(t)},this.Init=function(e,t,a,i,n,r,s,o,l,c,u,d){var h=document.querySelector(i),r=document.querySelector(r),n=document.querySelector(n),s=document.querySelector(s);null!=h&&null!=r||console.warn(i+" or "+r+": NULL"),this.Extend(e,t,a,h,n,r,s,o,l,c,u,d)}}function SlideToProductClass(e){var t="class-"+e,a=Array.from(galleryTop.slides).filter(function(e){return!!e.classList&&e.classList.contains(t)});a[0]&&(a.sort(function(e,t){return Array.from(e.classList).filter(function(e){return!!e&&e.startsWith("class-")}).length-Array.from(t.classList).filter(function(e){return!!e&&e.startsWith("class-")}).length}),e=Array.from(galleryTop.slides).findIndex(function(e){return e.dataset.slide===a[0].dataset.slide}),galleryTop.slideTo(e))}function LoadSwiperDefault(){galleryTop=new Swiper(".gallery-top",{spaceBetween:20,preloadImages:!0,centeredSlides:!0,lazy:{loadPrevNext:!0},pagination:".swiper-pagination",paginationType:"fraction",navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}});var e=document.querySelector(".gallery-thumbs");if(e){if((galleryThumbs=new Swiper(".gallery-thumbs",{spaceBetween:20,centeredSlides:!0,slidesPerView:e.dataset.itemShow||4,touchRatio:.2,slideToClickedSlide:!0}))instanceof Array)for(var t=0;t<galleryThumbs.length;t++)0<galleryThumbs[t].imagesToLoad.length&&((galleryTop[t].controller.control=galleryThumbs)[t].controller.control=galleryTop);else(galleryTop.controller.control=galleryThumbs).controller.control=galleryTop;galleryThumbs.update()}}function _LoadImageSwipe(e,t){var a,i=document.querySelectorAll(".pswp")[0],n=document.querySelector(e),r=[],s=document.querySelectorAll(e+" .gallery-top .swiper-slide > [itemprop=contentUrl]"),o=document.querySelectorAll(e+" .gallery-top [itemprop=thumbnail] ._p-slide-image"),l=document.querySelector(e+" .swiper-slide-active");l||console.warn("ko có thumb dùng top gallery");for(var c=0;c<s.length;c++)(a={src:o[c].dataset.src||o[c].src||o[c].src,w:o[c].width,h:o[c].height,alt:o[c].alt,author:n.dataset.author}).msrc=l.getAttribute("src"),a.el=l,a.title=n.dataset.seo,a.m={src:o[c].dataset.src||o[c].src||o[c].src,w:o[c].width,alt:o[c].alt,h:o[c].height,author:n.dataset.author},a.o={src:s[c].content,w:+s[c].parentElement.querySelector("[itemprop=width]").content,alt:o[c].alt,h:+s[c].parentElement.querySelector("[itemprop=height]").content,author:n.dataset.author},r.push(a);var u,d,h=new PhotoSwipe(i,PhotoSwipeUI_Default,r,{index:t,history:!1,focus:!1,hideAnimationDuration:0,getThumbBoundsFn:function(e){var t=r[e].el,e=window.pageYOffset||document.documentElement.scrollTop,t=t.getBoundingClientRect();return{x:t.left,y:t.top+e,w:t.width}},galleryUID:e}),m=!1,p=!0;h.listen("beforeResize",function(){var e=window.devicePixelRatio||1,e=Math.min(e,2.5);1200<=(u=h.viewportSize.x*e)||!h.likelyTouchDevice&&800<u||1200<screen.width?m||(d=m=!0,console.log(screen.width+"use largeImage")):m&&(d=!(m=!1),console.log(screen.width+"not use largeImage")),d&&!p&&h.invalidateCurrItems(),p=p&&!1,d=!1}),h.listen("gettingData",function(e,t){m?(t.src=t.o.src,t.alt=t.o.alt,t.w=t.o.w,t.h=t.o.h):(t.src=t.m.src,t.alt=t.o.alt,t.w=t.m.w,t.h=t.m.h)}),h.init()}function TabPages(){this.Extend=function(e,t,a){var i=e.dataset.activeTabNumber;this.SelectedTabNumber=+i||-1,this.NavElement=e,this.Tabs=t,this.TabContains=a,this.Process()},this.Process=function(){for(var i=this,e=0;e<this.Tabs.length;e++)this.Tabs[e].addEventListener("click",function(e){if(e.currentTarget.dataset.tabUrl&&history.replaceState(null,null,e.currentTarget.dataset.tabUrl),i.SelectedTabNumber=+e.currentTarget.dataset.tab||-1,i.NavElement.dataset.activeTabNumber=i.SelectedTabNumber,e.currentTarget.dataset.callback){for(var t=null,a=0;a<i.TabContains.length;a++)if(i.TabContains[a].dataset.tabContent===e.currentTarget.dataset.tab){t=i.TabContains[a];break}Site.GetFunction(e.currentTarget.dataset.callback,["tabNumber","tabContainerElement"]).apply(e.currentTarget,[i.SelectedTabNumber,t])}})},this.Init=function(e){var t,a=document.querySelector(e);a&&(t=a.parentNode.querySelectorAll("[data-tab]"),e=a.parentNode.querySelectorAll("[data-tab-content]"),this.Extend(a,t,e))}}function Quantity(){this.Extend=function(e,t,a,i){this.DownElement=e,this.UpElement=t,this.TargetElement=a,this.ValueChangeCallBack=i||function(){console.log("ValueChange don't have callback")},this.Process()},this.Process=function(){var t=this;this.UpElement.addEventListener("click",function(e){+t.TargetElement.value<+t.TargetElement.max&&(t.TargetElement.value=++t.TargetElement.value,t.ValueChangeCallBack&&Site.Debounce(t.ValueChangeCallBack(),2e3))}),this.DownElement.addEventListener("click",function(e){+t.TargetElement.value>+t.TargetElement.min&&(t.TargetElement.value=--t.TargetElement.value,t.ValueChangeCallBack&&Site.Debounce(t.ValueChangeCallBack(),2e3))}),this.TargetElement.addEventListener("keyup",function(e){+t.TargetElement.value>+t.TargetElement.max?t.TargetElement.value=+t.TargetElement.max:+t.TargetElement.value<+t.TargetElement.min&&(t.TargetElement.value=+t.TargetElement.min),t.ValueChangeCallBack&&t.ValueChangeCallBack()}),this.TargetElement.addEventListener("change",function(e){t.ValueChangeCallBack&&t.ValueChangeCallBack()})},this.Init=function(e,t){var a=e.querySelector("[data-minus]"),i=e.querySelector("[data-plus]"),e=e.querySelector("input[type='number']");this.Extend(a,i,e,t)}}function processAnonymousUser(e){for(var t=document.querySelectorAll(e+" li canvas"),a=0;a<t.length;a++){var i=t[a],n=i.dataset.userName.split(" "),r=2<n.length?n[0].charAt(0).toUpperCase()+n[1].charAt(0).toUpperCase():n[0].charAt(0).toUpperCase(),s=i.getContext("2d"),o=i.width,n=i.height;window.devicePixelRatio&&(i.setAttribute("width",o*window.devicePixelRatio),i.setAttribute("height",n*window.devicePixelRatio),i.style.width=o+"px",i.style.height=n+"px",s.scale(window.devicePixelRatio,window.devicePixelRatio)),s.fillStyle=Site.StringToHslColor(r,30,80),s.fillRect(0,0,i.width,i.height),s.font=n/2+"px Arial",s.textAlign="center",s.fillStyle="#FFF",s.fillText(r,o/2,n/1.5)}}function loadUserViewedProduct(){var e=LocalStorageHelper.Get(LocalStorageNamesEnum.ViewProductClassificationIds),t=document.querySelector("#productViewedContainer");if(e&&e.length&&t){var a=e.length;t.dataset.itemCount&&(a=Math.min(a,t.dataset.itemCount));for(var i=0;i<a;i++){var n=e[i],r='<a href="[ProductUrl]" title="[ProductName]" class="_image-wrap -tablet-margin-bottom rounded-4 border-1 solid border-silver padding-5"> <img alt="[ProductName]" loading="lazy" class="r-lazy" src="[ProductThumnailUrl]"></a>';r=(r=(r=r.replace(/\[ProductUrl\]/g,n.ProductUrl)).replace(/\[ProductName\]/g,n.ProductName)).replace(/\[ProductThumnailUrl\]/g,n.ProductThumnailUrl),n=Site.HtmlToElement(r),t.appendChild(n[0])}}}function innitFileUploadRatingQuestion(){var e,t,a,i;imputDocumentFileQuestion=document.getElementById("inputRatingFormFileQuestion"),inputUserNameQuestion=document.querySelector("#frmProductQuestion [name='UserName']"),inputEmailQuestion=document.querySelector("#frmProductQuestion [name='Email']"),btnRemoveAnwerFor=document.querySelector("#frmProductQuestion [button-awser-for]"),spanUserName=document.querySelector("#frmProductQuestion [button-awser-for] [data-user-name]"),inputParentId=document.querySelector("#frmProductQuestion #ParentId"),textArea=document.querySelector("#frmProductQuestion textarea"),imputDocumentFileQuestion&&(e=imputDocumentFileQuestion.dataset.curentPathFiles&&""!==imputDocumentFileQuestion.dataset.curentPathFiles?[imputDocumentFileQuestion.dataset.curentPathFiles]:null,t=imputDocumentFileQuestion.dataset.curentShowingImages&&""!==imputDocumentFileQuestion.dataset.curentShowingImages?[imputDocumentFileQuestion.dataset.curentShowingImages]:null,a=imputDocumentFileQuestion.dataset.maxFile&&""!==imputDocumentFileQuestion.dataset.maxFile?+imputDocumentFileQuestion.dataset.maxFile:3,i=imputDocumentFileQuestion.dataset.maxFile&&""!==imputDocumentFileQuestion.dataset.maxSize?+imputDocumentFileQuestion.dataset.maxSize:5,(fileUploadRatingQuestion=new FileUpload).Init(null,e,t,"#"+imputDocumentFileQuestion.id,"#reviewRatingQuestion","#reviewRatingQuestion","#frmProductQuestion",a,console.log("change"),!0,"RatingFormFile",i))}function processAnwserForInForm(){btnRemoveAnwerFor&&btnRemoveAnwerFor.addEventListener("click",function(e){e.currentTarget.classList.add("hide"),inputParentId.value=""})}function processAnwerClick(){for(var e=document.querySelectorAll("._id-listRatingQuestions [data-awser]"),t=0;t<e.length;t++)e[t].addEventListener("click",function(e){inputParentId.value=e.target.dataset.awser,spanUserName.textContent=e.target.dataset.awserName,btnRemoveAnwerFor.classList.remove("hide"),Site.ScrollToElement("#frmProductQuestion [button-awser-for]"),textArea.focus()})}function processAnonymousAvarta(){for(var e=document.querySelectorAll("._id-listRatingQuestions canvas"),t=0;t<e.length;t++){var a=e[t],i=a.dataset.userName.split(" "),n=2<i.length?i[0].charAt(0).toUpperCase()+i[1].charAt(0).toUpperCase():i[0].charAt(0).toUpperCase(),r=a.getContext("2d"),s=a.width,i=a.height;window.devicePixelRatio&&(a.setAttribute("width",s*window.devicePixelRatio),a.setAttribute("height",i*window.devicePixelRatio),a.style.width=s+"px",a.style.height=i+"px",r.scale(window.devicePixelRatio,window.devicePixelRatio)),r.fillStyle=Site.StringToHslColor(n,30,80),r.fillRect(0,0,a.width,a.height),r.font=i/2+"px Arial",r.textAlign="center",r.fillStyle="#FFF",r.fillText(n,s/2,i/1.5)}}function reloadImageCapcha(){var e=new Date;$("#img-captcha").attr("src","/get-captcha-image?"+e.getTime())}function processUserNameEmail(){inputUserNameQuestion&&!inputUserNameQuestion.value&&(inputUserNameQuestion.value=sessionStorage.getItem("UserName"),inputEmailQuestion.value=sessionStorage.getItem("Email"))}function updateSessionUser(){sessionStorage.setItem("UserName",inputUserNameQuestion.value),sessionStorage.setItem("Email",inputEmailQuestion.value)}function processVote(){for(var e=document.querySelectorAll("[data-vote-up],[data-vote-down]"),t=0;t<e.length;t++)e[t].addEventListener("click",function(e){e.currentTarget.disabled=!0,AjaxRequest.SendRequestGetJson("POST","rating/changeRatingScore",{isUp:e.currentTarget.hasAttribute("data-vote-up"),ratingId:e.currentTarget.dataset.ratingId},function(e,t){for(var a=JSON.parse(e),e=document.querySelector("[data-vote-container='"+a.ratingId+"']"),i=e.querySelectorAll("[data-vote-up],[data-vote-down]"),n=0;n<i.length;n++)i[n].disabled=!1;a.result?(e.querySelector("[data-point]").textContent=a.upvoteCount-a.downVoteCount,Site.NotifyFormSuccess(a.title,a.message)):Site.NotifyFormInfo(a.title,a.message)})})}function clearInput(){Site.ClearInputFile(imputDocumentFileQuestion),Site.ClearInputFile(textArea)}document.addEventListener("DOMContentLoaded",function(e){LoadSwiperDefault(),document.querySelector("._p-show-photowipe").addEventListener("click",function(e){var t=Array.from(galleryTop.slides).findIndex(function(e){return e.classList.contains("swiper-slide-active")})||galleryTop.activeIndex;_LoadImageSwipe(e.target.dataset.selector,t)})}),document.addEventListener("DOMContentLoaded",function(){}),document.addEventListener("DOMContentLoaded",function(){loadUserViewedProduct()}),document.addEventListener("DOMContentLoaded",function(){(imageCaptchaQuestion=document.querySelector("[data-captcha-container] ._image-wrap"))&&imageCaptchaQuestion.addEventListener("click",function(e){reloadImageCapcha()}),innitFileUploadRatingQuestion(),processUserNameEmail(),processVote(),processAnonymousAvarta(),processAnwserForInForm(),processAnwerClick()});var dataHead,didScroll=!1,isClick=!1;function headerTongleShowHide(){for(var n=document.querySelectorAll("#section4 header,#section2 header, #section6 header, #ratingSection header, #sectionQa header"),e=0;e<n.length;e++)n[e].addEventListener("click",function(e){for(var t=Site.FindParentByAttribute(e.target,"data-tab-content"),a=0;a<n.length;a++){var i=Site.FindParentByAttribute(n[a],"data-tab-content");i!=t&&i.classList.remove("_show")}Site.TongleClassElement(t,"_show")})}function innitFileUpload(){var e=document.getElementById("inputRatingFormFile"),t=e.dataset.curentPathFiles&&""!==e.dataset.curentPathFiles?[e.dataset.curentPathFiles]:null,a=e.dataset.curentShowingImages&&""!==e.dataset.curentShowingImages?[e.dataset.curentShowingImages]:null,i=e.dataset.maxFile&&""!==e.dataset.maxFile?+e.dataset.maxFile:3,e=e.dataset.maxFile&&""!==e.dataset.maxSize?+e.dataset.maxSize:5;(new FileUpload).Init(null,t,a,"#inputRatingFormFile","#newReviewContainer","#newReviewContainer","#frmProductRating",i,console.log("change"),!0,"RatingFormFile",e)}function clearform(){$("#frmProductRating")[0].reset();var e=document.getElementById("newReviewContainer");e&&(e.innerHTML="")}function loadIntersectionObserver(){for(var e={root:null,rootMargin:"0px",threshold:1},t=new IntersectionObserver(function(e){dataHead.dataset.sessionActive=e[0].target.querySelector("[data-section]").dataset.section},e),a=new IntersectionObserver(function(e){dataHead.dataset.sessionActive=e[0].target.querySelector("[data-section]").dataset.section},e),i=document.querySelectorAll("[site-navigation] button"),n=0;n<i.length;n++){var r=document.querySelector(i[n].getAttribute("content"));("section4"===r.id||"section6"===r.id?a:t).observe(r)}}function loadFlashSaleSwiper(){widgetFlashSaleSwiper(2,3,4)}function atiCopyRight(){var e=document.querySelector("[itemprop='itemListElement']:last-child"),t=e.innerText,a=e.querySelector("[content]").attributes.content.value,i=document.createElement("h3");i.classList="d-none";e=document.createElement("a");e.innerText="Nguồn: "+t+" tại "+window.location.hostname,e.href=a,e.alt="Chi tiết sản phẩm "+t+" tại "+window.location.hostname+". ",e.classList="_atyc",e.setAttribute("style","display:block !important;font-size:0 !important;height:0; color:transparent !important;  "),i.appendChild(e),i.setAttribute("style","display:block !important;font-size:0 !important;height:0; color:transparent !important;  ");e=document.querySelector("[data-html-content]");e.insertBefore(i,e.querySelector("h3 ~ p"))}function init(){activeProductClass=document.querySelector("[data-active-product-classification]"),listQuantities=document.querySelectorAll("._quantity"),chkOutOfStock=document.querySelector("[data-out-of-stock]"),txtQuantity=document.querySelector("[data-quantity]"),attribute1Items=document.querySelectorAll('input[name="Attribute1Value"]'),attribute2Items=document.querySelectorAll('[data-classification2] [type="radio"]'),productClassificationId=document.querySelector("[name=ProductClassificationId]"),dataPrice=document.querySelector("[data-price]"),dataDelPrice=document.querySelector("[data-del-price]"),idWholesaleInfo=document.getElementById("idWholesaleInfo"),discountPercentEle=document.querySelector("[data-css-discount]"),newestPostsContainer=document.querySelector("[data-selector-newest-post]"),flashSaleContainer=document.querySelector("[data-flash-sale-detail]"),dataCountEle=flashSaleContainer.querySelector("[data-count]"),dataProcessBarEle=flashSaleContainer.querySelector("progress"),dataHead=document.querySelector("main")}function reloadMoneyAndQuantity(){var e=!(0<arguments.length&&void 0!==arguments[0])||arguments[0],t=listPriceInfo[0].productClassificationId,a=document.querySelector("[data-classification-1] input[type=radio]:checked"),i=document.querySelectorAll("[data-classification2]");if(a){t=a.dataset.productClassId;for(var n,r=0;r<i.length;r++)i[r].dataset.classification2===a.value?(i[r].removeAttribute("hidden"),n=i[r].querySelector("input[type=radio]:checked"),t=n?n.dataset.productClassId:((n=i[r].querySelector("input[type=radio]")).checked=!0,n.dataset.productClassId)):i[r].setAttribute("hidden",!0)}var s=listPriceInfo.filter(function(e){return e.productClassificationId===t});if(activeProductClass.dataset.activeProductClassification=s[0].productClassificationId,e||(LoadSwiperDefault(),SlideToProductClass(s[0].productClassificationId)),0!==s.length){try{history.replaceState(null,null,s[0].url)}catch(e){}var o=s[0].quantity;productClassificationId.value=s[0].productClassificationId,chkOutOfStock.checked=o<=0,txtQuantity.max=o,0==+txtQuantity.value&&(txtQuantity.value=Math.min(txtQuantity.max,1)),+txtQuantity.value>+txtQuantity.max&&(txtQuantity.value=+txtQuantity.max);for(var e=s[0],l=e.quantitiesPrice,c=l[l.length-1].money,u=l[l.length-1].money,d=l[l.length-1].range,h=l.length-1;0<=h&&!(0!==l[h].range&&+txtQuantity.value>=l[h].range);h--)c=l[h].money,h!==l.length-1&&(u=l[h+1].money,d=l[h].range);dataPrice.innerHTML=WNumbHelper.GetFrNumber(c)+"<sup>đ</sup>",dataPrice.dataset.price=c,dataPrice.style.visibility="visible",dataDelPrice.dataset.delPrice=e.price,dataDelPrice.innerHTML=WNumbHelper.GetFrNumber(e.price)+"<sup>đ</sup>",idWholesaleInfo.innerHTML=u!==c?"Số lượng "+d+" để mua với giá "+WNumbHelper.GetFrNumber(u)+"<sup>đ</sup>":"";for(var m=document.querySelectorAll("#_z-barCode li"),p=0;p<m.length;p++)m[p].dataset.productClassId===s[0].productClassificationId?m[p].classList.add("active"):m[p].classList.remove("active");dataDelPrice.classList.add("hide"),c<+dataDelPrice.dataset.delPrice&&dataDelPrice.classList.remove("hide"),discountPercentEle.classList.add("hide");o=100-100*c/e.price;0<o&&(discountPercentEle.classList.remove("hide"),discountPercentEle.innerText=(e.isFlashSale?"Flash Sale -":"Giảm ")+Number(o).toFixed(2)+"%"),dataCountEle.removeAttribute("data-flash-deal-count-down"),dataProcessBarEle.removeAttribute("data-is-host"),flashSaleContainer.classList.add("hide"),e.isFlashSale&&(flashSaleContainer.classList.remove("hide"),e.valueQuantity<=0?(dataCountEle.dataset.flashDealCountDown=e.countDownTime,checkTimeCountDown("[data-css-simple-detail]")):dataCountEle.innerText="còn "+e.countDownQuantity+" sản phẩm",e.valueQuantity*e.maxHours>e.hours*e.maxValueQuantity?(dataProcessBarEle.setAttribute("data-is-hot","true"),dataProcessBarEle.max=e.maxValueQuantity,dataProcessBarEle.value=e.valueQuantity):(dataProcessBarEle.removeAttribute("data-is-hot"),dataProcessBarEle.max=e.maxHours,dataProcessBarEle.value=e.hours));var g=document.querySelector("#frmAddToCart");g&&window.addEventListener&&window.addEventListener("load",function(){var e=g.querySelectorAll("[name=ProductClassificationId]")[1].value||g.querySelectorAll("[name=ProductClassificationId]")[0].value,t=document.querySelector("[data-css-simple-detail] [type=radio]:checked"),a=null!=t?t.value:"",t=document.querySelector("[name=ProductName]").value;EnhancedEcommerce.AddImpression(e,t,a)})}else chkOutOfStock.checked=!0}function updateAnalytic(){var e,t,a,i=document.querySelector("#frmAddToCart");i&&(e=i.querySelectorAll("[name=ProductClassificationId]")[1].value||i.querySelectorAll("[name=ProductClassificationId]")[0].value,t=null!=(a=document.querySelector("[data-css-simple-detail] [type=radio]:checked"))?a.value:"",i=document.querySelector("[name=ProductName]").value,a=document.querySelector("[data-css-simple-detail] [data-price]").dataset.price,EnhancedEcommerce.AddProduct(e,i,t,"","",a))}function btnByNowClick(e){window.location=e.target.dataset.href}function load360Spin(){var e=document.querySelector(".spritespin");e&&(e.dataset.width?$(".spritespin").spritespin({source:image360Sources,width:Math.min(document.querySelector("#spin360").getBoundingClientRect().width,500),height:Math.min(document.querySelector("#spin360").getBoundingClientRect().width,500),sense:-1,frameTime:100,responsive:!1}):$(".spritespin").spritespin({source:image360Sources,width:500,height:500,sense:-1,frameTime:100,responsive:!0}))}function ratingCompleteCallBack(){console.log("Reload ratings"),document.querySelector("#ratingSection details").removeAttribute("open")}function loadJqueryZoom(){if(document.querySelector("[data-device=Desktop]"))for(var e=document.querySelectorAll("[data-zoom]"),t=0;t<e.length;t++)new Drift(e[t],{paneContainer:document.querySelector("[data-css-simple-detail]")})}document.addEventListener("DOMContentLoaded",function(){var e;for(init(),Site.LockOnsCroll=!1,e=0;e<listQuantities.length;e++)(new Quantity).Init(listQuantities[e],reloadMoneyAndQuantity);for(e=0;e<attribute1Items.length;e++)attribute1Items[e].addEventListener("change",function(e){reloadMoneyAndQuantity(!1)});for(e=0;e<attribute2Items.length;e++)attribute2Items[e].addEventListener("change",function(e){reloadMoneyAndQuantity(!1)});reloadMoneyAndQuantity(!0),loadJqueryZoom();try{JsBarcode("._barcode").init()}catch(e){console.log(e)}load360Spin(),atiCopyRight(),PushNotifications.initialize(),LocalStorageHelper.LogCategory(productCategoryId,!0,!1,!1,!1);var t=document.querySelector("[data-first-thumnail]").dataset.firstThumnail;LocalStorageHelper.LogProductClassIdView(activeProductClass.dataset.activeProductClassification,document.querySelector("[name=ProductName]").value,t,document.querySelector("link[rel='canonical']").href),processAnonymousUser("._id-listRatings"),innitFileUpload(),(new TabPages).Init("[data-main-section] [data-active-tab-number]"),headerTongleShowHide()});