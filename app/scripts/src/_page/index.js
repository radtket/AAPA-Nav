/* ---------------------------------------------
	Scripts initialization
	--------------------------------------------- */
/* eslint prefer-arrow-callback: 0 */ // --> OFF
$(window).load(function() {
	// Page loader
	$('body').imagesLoaded(function() {
		$('.page-loader div').fadeOut();
		$('.page-loader')
			.delay(200)
			.fadeOut('slow');
	});

	$(window).trigger('scroll');
	$(window).trigger('resize');
});

$(document).ready(function() {
	$(window).trigger('resize');
});

$(window).resize(function() {
	// js_height_init();
});
