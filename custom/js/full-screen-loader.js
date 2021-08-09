export function initFullScreenLoader() {
	hideFullScreenLoader();
}

export function showFullScreenLoader(title, subtitle) {
	const defaultTitle = 'Loading';
	const defaultSubTitle = '';
	$('.full-screen-loader-title').text(title || defaultTitle);
	$('.full-screen-loader-subtitle').text(subtitle || defaultsubTitle);
	$('#full-screen-loader').fadeIn();
}

export function hideFullScreenLoader() {
	$('#full-screen-loader').fadeOut();
}
