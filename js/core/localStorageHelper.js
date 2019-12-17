/* * * * * * * * * * * * * * * * *
 * SessionStorageHelper
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

var LocalStorageHelper = {
    // --------------------
    // Utility
    // --------------------
    // converting initialize data
    Get(localStorageNamesEnum) {
        var resultValue = localStorage.getItem(localStorageNamesEnum);
        return !resultValue ? [] : JSON.parse(resultValue);
    },
    LogProductClassIdView: function(productClassId,productName, productThumnailUrl, productUrl) {
        var listProductClass = localStorage.getItem(LocalStorageNamesEnum.ViewProductClassificationIds);
        debugger;
        listProductClass = (!listProductClass) ? [] : JSON.parse(listProductClass);

        var existProductClass = listProductClass.find(x => x.Classificationid === productClassId);

        if (!!existProductClass) {
            listProductClass = listProductClass.filter(function (el) { return el.Classificationid !== productClassId; }); 
        }

        var productClassObject = {
            Classificationid: productClassId,
            ProductName: productName,
            ProductThumnailUrl: productThumnailUrl,
            ProductUrl: productUrl
        };

        listProductClass.unshift(productClassObject);
        listProductClass.length = Math.min(listProductClass.length,12);
        localStorage.setItem(LocalStorageNamesEnum.ViewProductClassificationIds, JSON.stringify(listProductClass));
    },
    LogCategory: function (categoryId,isView, isAddToCart, isPay, isComplete ) {
        var listComplexCategory = localStorage.getItem(LocalStorageNamesEnum.UserCategoryList);
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
            if (isView && existCategory.ViewCount < Number.MAX_SAFE_INTEGER) {
                existCategory.ViewCount += 1;
            }
            else if (isAddToCart && existCategory.AddToCartCount < Number.MAX_SAFE_INTEGER) {
                existCategory.AddToCartCount += 1;
            }
            else if (isPay && existCategory.InOrderCount < Number.MAX_SAFE_INTEGER) {
                existCategory.InOrderCount += 1;
            }
            else if (isComplete && existCategory.CompleteCount < Number.MAX_SAFE_INTEGER) {
                existCategory.CompleteCount += 1;
            }
        }
  
        localStorage.setItem(LocalStorageNamesEnum.UserCategoryList, JSON.stringify(listComplexCategory));
    },
    //RemoveCategory: function (proId) {
    //    var listSaved = LocalStorageHelper._Get(LocalStorageNamesEnum.PropertySaved);
    //    listSaved = (!listSaved) ? [] : JSON.parse(listSaved);
    //    debugger;
    //    listSaved.splice(0, 0, +proId);
    //    listSaved = listSaved.GetUnique();
    //    listSaved.length = listSaved.length < 5 ? listSaved.length : 5;
    //    console.log(listSaved);
    //    LocalStorageHelper._Save(LocalStorageNamesEnum.PropertySaved, JSON.stringify(listSaved), 7);
    //},
    // init
    Init: function () {
    }
};

var LocalStorageNamesEnum = {
    UserCategoryList: "CategoryList",
    ViewProductClassificationIds: "ViewProductClassificationIds"
};

/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */

document.addEventListener('DOMContentLoaded', LocalStorageHelper.Init(), false);

