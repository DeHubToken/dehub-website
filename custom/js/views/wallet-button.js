import {
	currUser,
	logIn,
	logOut,
	isChainCorrect,
	askToSwitchChain,
} from '../controllers/auth.js';

function showConnectedWallet(user) {
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

function showDisconnectedWallet() {
	const $connectedWallet = $('.connected-wallet');
	const $label = $connectedWallet.find('.label');
	const label = `Loading...`;
	$label.text(label);
	// Visibility
	$('.connect-wallet').removeClass('d-none');
	$connectedWallet.addClass('d-none');
}

/* ----------------------------- Event listeners ---------------------------- */
$(document).on('logged:in', (_, user) => {
	console.log('[WALLET-BUTTON][EVENT]: logged:in');
	console.log(user);
	$('#walletConnectModal').modal('hide');
	if (isChainCorrect()) {
		showConnectedWallet(user);
	}
});

$(document).on('logged:out', () => {
	console.log('[WALLET-BUTTON][EVENT]: logged:out');
	showDisconnectedWallet();
});

$('.connect-wallet').on('click', async (e) => {
	e.preventDefault();
	const user = currUser();
	if (user) {
		if (isChainCorrect()) {
			showConnectedWallet(user);
		} else {
			await askToSwitchChain();
		}
	} else {
		$('#walletConnectModal').modal();
	}
});

$('#walletConnectModal .btn').on('click', async (e) => {
	e.preventDefault();
	const providerName = $(e.target).data('provider');
	await logIn(providerName);
});

$('.logout').on('click', async (e) => {
	e.preventDefault();
	await logOut();
});

/* -------------------------------- Listeners ------------------------------- */
