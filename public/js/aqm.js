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
	},
	stop: function( event, ui ) {
		$.ajax({
			url: '/debug/i2c/channel/' + $(this).attr('data-id') + '/value/' + ui.value,
			type: 'PUT',
			success: function(data) {	}
		});
	}
});

$('.i2cCheckbox').change(function() {
	$.ajax({
		url: '/debug/i2c/channel/' + $(this).attr('data-id') + '/value/' + ($(this).is(":checked") ? 100 : 0),
		type: 'PUT',
		success: function(data) {	}
	});
});