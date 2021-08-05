$(document).ready(() => {
	const $navDropdown = $('#nav-dropdown');
	const $header = $('header');
	$navDropdown.on('show.bs.dropdown', () => {
		setTimeout(() => {
			$header.css('overflow', 'visible');
		}, 1);
	});

	$navDropdown.on('hidden.bs.dropdown', () => {
		$header.css('overflow', 'hidden');
	});

	$(window).scroll(function () {
		$navDropdown.dropdown('hide');
	});
});
