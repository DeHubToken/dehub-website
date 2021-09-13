// Fetch template and update the DOM
fetch('./components/footer/template.html')
	.then((response) => response.text())
	.then((data) => initFooter(data));

function initFooter(data) {
	// Update DOM
	const $component = $('footer');
	$component.html(data);
	$component.addClass('pt-70 pb-65 text-center footer_2');
	const options = $component.data('options');

	if (options && options.disclaimer === false) {
		$component.find('.disclaimer-link').remove();
	}
}
