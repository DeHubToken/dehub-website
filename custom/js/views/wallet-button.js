import { currUser, logIn, logOut } from '../controllers/auth.js';

function renderConnectedWallet(user) {
	if (user) {
		const $connectedWallet = $('.connected-wallet');
		const $label = $connectedWallet.find('.label');
		const addr = user.attributes.ethAddress;
		const label = `${addr.substring(0, 6)}...${addr.substring(38)}`;
		$label.text(label);
		// Visibility
		$('.connect-wallet').addClass('d-none');
		$connectedWallet.removeClass('d-none');
	}
}

function renderDisconnectedWallet() {
	const $connectedWallet = $('.connected-wallet');
	const $label = $connectedWallet.find('.label');
	const label = `Loading...`;
	$label.text(label);
	// Visibility
	$('.connect-wallet').removeClass('d-none');
	$connectedWallet.addClass('d-none');
}

/* ----------------------------- Event listeners ---------------------------- */
$(document).ready(() => {
	const user = currUser();
	if (user) {
		console.log('Already logged in');
		console.log(user);
		renderConnectedWallet(user);
	}
});

$('.connect-wallet').on('click', async (e) => {
	e.preventDefault();
	let user = currUser();
	if (!user) {
		user = await logIn();
	}
	renderConnectedWallet(user);
});

$('.logout').on('click', async (e) => {
	e.preventDefault();
	await logOut();
	renderDisconnectedWallet();
});
