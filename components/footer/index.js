$(() => {
	// Fetch template and update the DOM
	fetch('./components/footer/template.html')
		.then((response) => response.text())
		.then((data) => initFooter(data));
});

function initFooter(data) {
	// Update DOM
	document.querySelector('footer').innerHTML = data;
	$('footer').addClass('pt-70 pb-65 text-center footer_2');
}
