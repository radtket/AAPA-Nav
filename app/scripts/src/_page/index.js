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
	init_classic_menu();
});

$(window).resize(function() {
	// js_height_init();
});

$('.owl-carousel').owlCarousel({
	loop: true,
	nav: false,
	items: 1,
	autoplay: true,
	autoplayTimeout: 7000,
	autoplayHoverPause: true,
});

function init_classic_menu() {
	$('.nav__menu-item--depth0').click(function(e) {
		if ($('.header__tertiary').hasClass('header__tertiary--active')) {
			$('.header__tertiary').removeClass('header__tertiary--active');
			$(this).removeClass('current-menu-item');
		} else {
			$('.header__tertiary').addClass('header__tertiary--active');
			$(this).addClass('current-menu-item');
		}
	});
}
