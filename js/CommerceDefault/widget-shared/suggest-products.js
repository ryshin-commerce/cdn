"use strict";

function loadSuggestProducts() {
    var productClassObjs = LocalStorageHelper.Get(LocalStorageNamesEnum.UserCategoryList).sort(
        (a, b) => (a.InOrderCount * 5 + a.CompleteCount * 3 + a.AddToCartCount * 2 + a.ViewCount >
            b.InOrderCount * 5 + b.CompleteCount * 3 + b.AddToCartCount * 2 + b.ViewCount)
        ? 1
            : -1);
    productClassObjs.length = Math.min(3, productClassObjs.length) ;

    var inputContainer = document.querySelector("#formLazySuggestProduct #inputContainer");
    var html = "";

    for (var i = 0; i < productClassObjs.length; i++) {
        var inputCategoryId = '<input class="hide" type="text" name="CategoryLogModels[' + i + '].CategoryId" value="' + productClassObjs[i].CategoryId + '">';
        var inputViewCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].ViewCount" value="' + productClassObjs[i].ViewCount + '">';
        var inputAddToCartCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].AddToCartCount" value="' + productClassObjs[i].AddToCartCount + '">';
        var inputInOrderCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].InOrderCount" value="' + productClassObjs[i].InOrderCount + '">';
        var inputCompleteCount = '<input class="hide" type="number" name="CategoryLogModels[' + i + '].CompleteCount" value="' + productClassObjs[i].CompleteCount + '">';
        html += (inputCategoryId + inputViewCount + inputAddToCartCount + inputInOrderCount + inputCompleteCount);
    }

    inputContainer.innerHTML = html;
    document.getElementById("btnReloadSuggestProduct").click();
}
