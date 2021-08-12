export function initFullScreenLoader() {
	hideFullScreenLoader();
}

export function showFullScreenLoader(title, subtitle) {
	const defaultTitle = 'Loading';
	const defaultSubTitle = '';
	$('.full-screen-loader-title').text(title || defaultTitle);
	$('.full-screen-loader-subtitle').text(subtitle || defaultSubTitle);
	$('#full-screen-loader').fadeIn();
}

export function hideFullScreenLoader() {
	$('#full-screen-loader').fadeOut();
}

/* ----------------------------- Event listeners ---------------------------- */

$(document).on('fullScreenLoader:show', async (_, title, subtitle) => {
	console.log(title, subtitle);
	console.log('[FULL-SCREEN-LOADER][EVENT]: fullScreenLoader:show');
	showFullScreenLoader(title, subtitle);
});

$(document).on('fullScreenLoader:hide', async () => {
	console.log('[FULL-SCREEN-LOADER][EVENT]: fullScreenLoader:hide');
	hideFullScreenLoader();
});
