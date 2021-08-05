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

$('.connect-wallet').on('click', (e) => {
	e.preventDefault();
	let user = currUser();
	if (!user) {
		$('#walletConnectModal').modal();
	}
	// renderConnectedWallet(user);
});

$('#walletConnectModal .btn.metamask').on('click', async (e) => {
	e.preventDefault();
	console.log('!!!!!!!!');
	logIn('metamask');
});

$('#walletConnectModal .btn.walletconnect').on('click', async (e) => {
	e.preventDefault();
	logIn('walletconnect');
});

$('.logout').on('click', async (e) => {
	e.preventDefault();
	await logOut();
	renderDisconnectedWallet();
});
