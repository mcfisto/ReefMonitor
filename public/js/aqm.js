$(document).ready(function () { 
    $(".aqm-input-float").keyup(function (evt) {
        this.value = this.value.replace(/,/g, ".");
    });
});