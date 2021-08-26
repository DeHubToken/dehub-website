import {
	initAuth,
	currUser,
	logIn,
	logOut,
	isChainCorrect,
	askToSwitchChain,
	linkAccount,
	authProvider,
} from '../controllers/auth.js';
import { truncateAddress, isMobile } from '../helpers.js';

const $doc = $(document);

$doc.ready(async () => {
	await initAuth();
	prepareForDevice();
});

async function showConnectedWallet() {
	const user = currUser();
	if (user) {
		const $connectedWallet = $('.connected-wallet');
		const $label = $connectedWallet.find('.label');
		const signer = authProvider.getSigner();
		const signerAddr = await signer.getAddress();
		console.log(signerAddr);
		const label = truncateAddress(signerAddr);
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
	$('.modal').modal('hide');
}

function prepareForDevice() {
	if (isMobile()) {
		$('#walletConnectModal').find(`[data-provider='metamask']`).parent().hide();
	}
}

/* ----------------------------- Event listeners ---------------------------- */
$doc.on('logged:in', async (_, user, authProvider) => {
	console.log('[WALLET-BUTTON][EVENT]: logged:in');
	console.log(user);
	$('.modal').modal('hide');
	if (isChainCorrect()) {
		await showConnectedWallet();
	}
});

$doc.on('logged:out', () => {
	console.log('[WALLET-BUTTON][EVENT]: logged:out');
	showDisconnectedWallet();
});

$doc.on('account:changed:new', (_, account) => {
	console.log('[WALLET-BUTTON][EVENT]: account:changed:new');
	const $modal = $('#accountLinkModal');
	const label = `New address detected: ${truncateAddress(account)}`;
	$('#accountLinkModal .accountLink').data('account', account);
	$modal.find('.accountAddr').text(label);
	$modal.modal();
});

$doc.on('account:changed:old', () => {
	console.log('[WALLET-BUTTON][EVENT]: account:changed:old');
	// showConnectedWallet();
});

$('.connect-wallet').on('click', async (e) => {
	e.preventDefault();
	const user = currUser();
	if (user) {
		if (isChainCorrect()) {
			await showConnectedWallet();
		} else {
			await askToSwitchChain();
		}
	} else {
		$('#walletConnectModal').modal();
	}
});

$('#walletConnectModal .modal-body .btn').on('click', async (e) => {
	e.preventDefault();
	const providerName = $(e.target).data('provider');
	await logIn(providerName);
});

$('.logout').on('click', async (e) => {
	e.preventDefault();
	await logOut();
});

$('#accountLinkModal .accountLink').on('click', async (e) => {
	e.preventDefault();
	const acc = $(e.target).data('account');
	linkAccount(acc);
});

/* -------------------------------- Listeners ------------------------------- */
