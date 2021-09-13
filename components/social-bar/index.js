// Fetch template and update the DOM
fetch('./components/social-bar/template.html')
	.then((response) => response.text())
	.then((data) => initSocialBar(data));

function initSocialBar(data) {
	// Update DOM
	const $component = $('social-bar');
	$component.html(data);
}
