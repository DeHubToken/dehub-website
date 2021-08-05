/**
 * Moralis integration with authentication handling.
 */

import * as ethers from '/custom/libs/ethers/ethers-5.1.esm.min.js';

Moralis.initialize('4VxfmspNNL6kh39h2pleJx9nuN2YGKbvoFXPofcX');
Moralis.serverURL = 'https://phcmjyh5no3n.usemoralis.com:2053/server';
Moralis.Web3.getSigningData = () =>
	'Welcome to DeHub! To proceed securely please sign this connection.';

let authProvider = authenticateProvider();
function authenticateProvider() {
	const $doc = $(document);
	const user = currUser();
	if (user) {
		const authProvider = new ethers.providers.Web3Provider(window.ethereum);
		// Moralis user exists and provider created.
		// We can say authentication is complete. Listen to this event to update states.
		$doc.ready(() => $doc.trigger('logged:in', [user, authProvider]));
		return authProvider;
	} else {
		console.info('User has not been authenticated via Moralis yet.');
		// Listen to this even to update states on log out.
		$doc.ready(() => $doc.trigger('logged:out'));
		return undefined;
	}
}

export function currUser() {
	const user = Moralis.User.current();
	console.log('User:', user);
	return user;
}

export async function logIn(providerName) {
	let user = currUser();
	if (!user) {
		try {
			const params = { provider: providerName };
			user = await Moralis.Web3.authenticate(params);
			authProvider = authenticateProvider();
		} catch (error) {
			console.log(error);
			// Most likely user canceled signature.
			// We just silence the error here for now. You will still see Metamask
			// error in the console, but this is better than two unhandled errors :))
		}
	}
	return user;
}

export async function logOut() {
	await Moralis.User.logOut();
	authProvider = undefined;
	const $doc = $(document);
	$doc.ready(() => $doc.trigger('logged:out'));
}

/* -------------------------------- Listeners ------------------------------- */

/**
 * Once user has at least one account, this will listen to account changes and
 * prompt to link the changed account to a Moralis account.
 */
Moralis.Web3.onAccountsChanged(async (accounts) => {
	if (currUser()) {
		const confirmed = confirm(
			'Do you want to link this address to your account?'
		);
		if (confirmed) {
			await Moralis.Web3.link(accounts[0]);
		}
	}
});

// TODO: handle this
// function updateProviderListeners() {
// 	authProvider.provider.on('connect', (connectInfo) => {
// 		console.log(connectInfo);
// 	});

// 	authProvider.provider.on('accountsChanged', (accounts) => {
// 		console.log(accounts);
// 		console.log(authProvider.provider.isConnected());
// 	});

// 	authProvider.provider.on('chainChanged', (chainId) => {
// 		console.log(chainId);
// 	});
// }
