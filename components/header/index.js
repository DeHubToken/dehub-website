// Fetch template and update the DOM
fetch('/components/header/template.html')
	.then((response) => response.text())
	.then((data) => initHeader(data));

function initHeader(data) {
	// Update DOM
	const $component = $('header');
	$component.html(data);
	$component.addClass('pt-160 pb-60 header_5');
	const options = $component.data('options');
	if (options) {
		if (options.size === 'small') {
			$component.find('.header-small-title').show();
			$component.find('.header-big-title').remove();
		} else if (options.size === 'big') {
			$component.find('.header-big-title').show();
			$component.find('.header-small-title').remove();
		} else {
			$component.find('.header-big-title').remove();
			$component.find('.header-small-title').remove();
		}
	}

	// Fix bootstrap dropdown overlow issue inside header
	const $navDropdown = $('#nav-dropdown');
	$navDropdown.on('show.bs.dropdown', () => {
		setTimeout(() => {
			$component.css('overflow', 'visible');
		}, 1);
	});

	$navDropdown.on('hidden.bs.dropdown', () => {
		$component.css('overflow', 'hidden');
	});

	$(window).on('scroll', () => {
		$navDropdown.dropdown('hide');
	});
}
