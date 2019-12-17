/* * * * * * * * * * * * * * * * *
 * AjaxRequest
 * javascript page navigation
* http://maciejlis.com/asp-net-core-async-javascript-file-upload/
 * * * * * * * * * * * * * * * * */

var AjaxRequest = {
    SendFormData: function(method, url, formData, callback, failCallBack) {
        var xhr = new XMLHttpRequest();
        //formData.append("serialnumber", serialNumber++);
        //data = JSON.stringify(data);
        xhr.open(method, url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //xhr.setRequestHeader('Content-Length', data.length);
        // We define what will happen if the data are successfully sent
        xhr.onreadystatechange = function(aEvt) {
            try {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status >= 200 && xhr.status<300) {
                    callback(xhr.responseText,xhr.status);
                }
            } catch (e) {
                if (!!failCallBack) {
                    failCallBack(e);
                }
                console.log(e);
                alert("There was an error processing your request. Please try again later.", false);
            }
        };

        xhr.send(formData);
    },
    SendRequestGetJson: function(method,url, data, callback) {
        var xhr = new XMLHttpRequest();
        var fd  = new FormData();
    
        for(name in data) {
            fd.append(name, data[name]);
        }

        //data = JSON.stringify(data);
        xhr.open(method, url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //xhr.setRequestHeader('Content-Length', data.length);
        // We define what will happen if the data are successfully sent
        xhr.onreadystatechange = function(aEvt) {
            try {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status >= 200 && xhr.status < 300) {
                    callback(xhr.responseText, xhr.status);
                }
            } catch (e) {
                console.log(e);
                alert("There was an error processing your request. Please try again later.", false);
            }
        };

        xhr.send(fd);
    }
};



/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */

//var init = function () {
//    AjaxRequest.Init({
//        size: 30, // pages size
//        page: 1,  // selected page
//        step: 3   // pages before and after current
//    });
//};

//document.addEventListener('DOMContentLoaded', init, false);

