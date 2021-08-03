/**
 * Moralis integration
 */
$(document).ready(function () {
	moralisInit();
	const user = currUser();
	if (user) {
		console.log('Already logged in');
		console.log(user);
		renderConnectedWallet(user);
	}
});

function moralisInit() {
	Moralis.initialize('qYPpbsEGdwTUjz3B8I23NXoy8DVBGBpAfSHHvyQF');
	Moralis.serverURL = 'https://kakpr5xrgbmw.usemoralis.com:2053/server';
	Moralis.Web3.getSigningData = () =>
		'Welcome to DeHub! To proceed securely please sign this connection.';
}

function currUser() {
	const user = Moralis.User.current();
	return user;
}

async function logIn() {
	let user = currUser();
	if (!user) {
		try {
			user = await Moralis.Web3.authenticate();
		} catch (error) {
			console.log(error);
			// Most likely user canceled signature.
			// We just silence the error here for now. You will still see Metamask
			// error in the console, but this is better than two unhandled errors :))
		}
	}
	console.log('logged in user:', user);
	return user;
}

async function logOut() {
	await Moralis.User.logOut();
	console.log('logged out');
}

$('#connect-wallet').on('click', async (e) => {
	e.preventDefault();
	let user = currUser();
	if (!user) {
		user = await logIn();
	}
	renderConnectedWallet(user);
});

$('#logout').on('click', async (e) => {
	e.preventDefault();
	await logOut();
	renderDisconnectedWallet();
});

function renderConnectedWallet(user) {
	if (user) {
		const $connectedWallet = $('#connected-wallet');
		const $label = $connectedWallet.find('.label');
		const addr = user.attributes.ethAddress;
		const label = `${addr.substring(0, 6)}...${addr.substring(38)}`;
		$label.text(label);
		// Visibility
		$('#connect-wallet').addClass('d-none');
		$connectedWallet.removeClass('d-none');
	}
}

function renderDisconnectedWallet() {
	const $connectedWallet = $('#connected-wallet');
	const $label = $connectedWallet.find('.label');
	const label = `Loading...`;
	$label.text(label);
	// Visibility
	$('#connect-wallet').removeClass('d-none');
	$connectedWallet.addClass('d-none');
}
