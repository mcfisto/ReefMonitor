$(document).ready(function () { 
    $(".aqm-input-float").keyup(function (evt) {
        this.value = this.value.replace(/,/g, ".");
    });
});

$(".i2cSlider").slider({
	range: "min",
	value: 0,
	min: 0,
	max: 100,
	slide: function( event, ui ) {
		$( "#"+this.id+"Label" ).html( "" + ui.value + "%" );
	}
});

$('.i2cCheckbox').change(function() {
	$.ajax({
		url: '/debug/i2c/channel/3/value/' + ($(this).is(":checked") ? 100 : 0),
		type: 'PUT',
		success: function(data) {	}
	});
});