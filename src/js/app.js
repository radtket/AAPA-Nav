/* eslint-disable func-names, prefer-arrow-callback */

$(".owl-carousel").owlCarousel({
	loop: true,
	nav: false,
	items: 1,
	autoplay: true,
	autoplayTimeout: 7000,
	autoplayHoverPause: true
});

function initMenu() {
	$(".nav__menu-item--depth0").click(function(e) {
		if ($(".header__tertiary").hasClass("header__tertiary--active")) {
			$(".header__tertiary").removeClass("header__tertiary--active");
			$(this).removeClass("current-menu-item");
		} else {
			$(".header__tertiary").addClass("header__tertiary--active");
			$(this).addClass("current-menu-item");
		}
	});
}

/* ---------------------------------------------
	Scripts initialization
	--------------------------------------------- */

$(window).load(function() {
	// Page loader
	$("body").imagesLoaded(
		{
			background: true
		},
		() => {
			$(".page-loader div").fadeOut();
			$(".page-loader")
				.delay(200)
				.fadeOut("slow");
		}
	);

	$(window).trigger("scroll");
	$(window).trigger("resize");
});

$(document).ready(function() {
	$(window).trigger("resize");
	initMenu();
});
