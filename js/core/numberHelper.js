Number.prototype.ToMoney = function () {
    var number = this;

    if (Math.round(number) === 0) {
        return "$--";
    }

    var money;
    var subfix;

    if (number > 1000000000) {
        money = number / 1000000000;
        subfix = "tỷ";
    }
    else if (number > 1000000) {
        money = number / 1000000;
        subfix = "T";
    }
    else if (number > 1000) {
        money = number / 1000;
        subfix = "K";
    } else {
        return "$--"; 
    }

    return "$" + Math.round(money * 100) / 100 +" "+ subfix;
}
Number.prototype.ToFrDouble = function () {
    var number = this;
    return ("" + number).replace(".", ",");
};

Number.prototype.ToDouble = function () {
    var number = this;
    return ("" + number).replace(",", ".");
};

var NumberHelper = {
    // converting initialize data
    Extend: function (data) {
    },

    // find pagination type
    ToFrDouble: function (number) {
        return ("" + number).replace(".", ",");
    },

    ToDouble: function (number) {
        return +("" + number).replace(",", ".");
    },
    // init can't call new google.maps.xxx in this function
    Init: function (data) {
        NumberHelper.Extend(data);
    }

};



/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */

