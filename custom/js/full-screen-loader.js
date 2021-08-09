export function initFullScreenLoader() {
	hideFullScreenLoader();
}

export function showFullScreenLoader() {
	$('#full-screen-loader').fadeIn();
}

export function hideFullScreenLoader() {
	$('#full-screen-loader').fadeOut();
}
