/**
 * Global universal custom scripts.
 */

$(document).ready(function () {
	MY_scripts();
	$('[data-toggle="popover"]').popover({
		trigger: 'hover',
	});
});

function MY_scripts() {
	console.log('MY Scripts initialized!');
	/* ------------------------------ Click to copy ----------------------------- */
	function copy(text) {
		const inp = document.createElement('input');
		document.body.appendChild(inp);
		inp.value = text;
		inp.select();
		document.execCommand('copy', false);
		inp.remove();
	}

	let copyProcessing = false;
	$('.clickToCopy').on('click', (e) => {
		if (!copyProcessing) {
			copyProcessing = true;
			copy(e.target.innerText);
			const orig = $(e.target).text();
			$(e.target).text('Copied to clipboard!');
			setTimeout(() => {
				$(e.target).text(orig);
				copyProcessing = false;
			}, 3000);
		}
	});

	/* ---------------------------- Coming soon click --------------------------- */
	let comingSoonCoolDown = false;
	$('.comingSoon').on('click', (e) => {
		e.stopImmediatePropagation();
		e.preventDefault();
		if (!comingSoonCoolDown) {
			comingSoonCoolDown = true;
			const orig = $(e.target).text();
			$(e.target).text('Coming soon!');
			setTimeout(() => {
				$(e.target).text(orig);
				comingSoonCoolDown = false;
			}, 500);
		}
	});

	$('.preventDefault').on('click', (e) => {
		e.preventDefault();
	});
}
