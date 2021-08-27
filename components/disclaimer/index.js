$(() => {
	// Fetch template and update the DOM
	fetch('./components/disclaimer/template.html')
		.then((response) => response.text())
		.then((data) => initDisclaimer(data));
});

function initDisclaimer(data) {
	// Update DOM
	const $component = $('disclaimer');
	$component.html(data);

	// Enable event listeners
	const $disclaimerModal = $('#disclaimerModal');
	$(window).on('scroll', () => {
		if ($(window).scrollTop() + $(window).height() == $(document).height()) {
			const confirmed = window.localStorage.getItem('disclaimerConfirmed');
			if (!confirmed) {
				$disclaimerModal.modal();
			}
		}
	});

	$('#disclaimerModalConfirm').on('click', (e) => {
		e.preventDefault();
		window.localStorage.setItem('disclaimerConfirmed', true);
		$disclaimerModal.modal('hide');
	});

	$disclaimerModal.on('hidden.bs.modal', (e) => {
		$disclaimerModal.modal('dispose');
	});
}
