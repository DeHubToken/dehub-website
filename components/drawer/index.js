$(() => {
	// Fetch template and update the DOM
	fetch('./components/drawer/template.html')
		.then((response) => response.text())
		.then((data) => initDrawer(data));
});

function initDrawer(data) {
	// Update DOM
	const $component = $('drawer');
	$component.html(data);

	$(window).on('resize', () => showMenuBtn());
	showMenuBtn();

	$('.open_menu').on('click', (e) => {
		e.preventDefault();
		$('.navigation_mobile').addClass('opened');
	});

	$('.close_menu, header, section, footer, .navigation_mobile .inner a').on(
		'click',
		(e) => {
			// e.preventDefault();
			$('.navigation_mobile').removeClass('opened');
		}
	);
}

function showMenuBtn() {
	if ($(window).width() < 1199.98) {
		$('.open_menu').addClass('d-block');
		$('header nav').addClass('d-none');
		$('.navigation_mobile').removeClass('opened');
	} else {
		$('.open_menu').removeClass('d-block');
		$('header nav').removeClass('d-none');
		$('.navigation_mobile').removeClass('opened');
	}
}
