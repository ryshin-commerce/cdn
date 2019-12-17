/* * * * * * * * * * * * * * * * *
 * SessionStorageHelper
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

var CookieHelper = {
    // --------------------
    // Utility
    // --------------------
    // converting initialize data
    _Save: function (cookieHelperEnum, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cookieHelperEnum + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
    },
    _Get: function (cookieHelperEnum) {
        var name = cookieHelperEnum + "=";
        debugger;
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return "";
    },
    _Check: function(cookieHelperEnum) {
        var cValue = CookieHelper._Get(cookieHelperEnum);
        if (cValue !== "") {
            return true;
        } else {
            return false;
        }
    },
    LogCategory: function (categoryId,isView, isAddToCart, isPay, isComplete ) {
        var listComplexCategory = CookieHelper._Get(CookieNamesEnum.UserCategoryList);
        listComplexCategory = (!listComplexCategory) ? [] : JSON.parse(listComplexCategory);
        var existCategory = listComplexCategory.find(x => x.CategoryId === categoryId);

        if (!existCategory) {
            existCategory = {
                CategoryId: categoryId,
                ViewCount: isView ? 1 : 0,
                AddToCartCount: isAddToCart ? 1 : 0,
                InOrderCount: isPay ? 1 : 0,
                CompleteCount: isComplete?1:0
            };
            listComplexCategory.push(existCategory);
        } else {
            if (isView) {
                existCategory.ViewCount += 1;
            }
            else if (isAddToCart) {
                existCategory.AddToCartCount += 1;
            }
            else if (isPay) {
                existCategory.InOrderCount += 1;
            }
            else if (isComplete) {
                existCategory.CompleteCount += 1;
            }
        }
  
        CookieHelper._Save(CookieNamesEnum.UserCategoryList, JSON.stringify(listComplexCategory),365);
    },
    //RemoveCategory: function (proId) {
    //    var listSaved = CookieHelper._Get(CookieNamesEnum.PropertySaved);
    //    listSaved = (!listSaved) ? [] : JSON.parse(listSaved);
    //    debugger;
    //    listSaved.splice(0, 0, +proId);
    //    listSaved = listSaved.GetUnique();
    //    listSaved.length = listSaved.length < 5 ? listSaved.length : 5;
    //    console.log(listSaved);
    //    CookieHelper._Save(CookieNamesEnum.PropertySaved, JSON.stringify(listSaved), 7);
    //},
    // init
    Init: function () {
    }
};

var CookieNamesEnum = {
    UserCategoryList: "CategoryList"
};

/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */

document.addEventListener('DOMContentLoaded', CookieHelper.Init(), false);

