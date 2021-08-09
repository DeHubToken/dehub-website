/**
 * Moralis integration with authentication handling.
 */

import * as ethers from '/custom/libs/ethers/ethers-5.1.esm.min.js';

// Mainnet
// const CHAIN_ID = '0x38'; // mainnet
// Testnet
const CHAIN_ID = '0x61';
const RPC_URL = 'https://data-seed-prebsc-2-s3.binance.org:8545/';

Moralis.initialize('V0nRrGNuSWyuthhvcLDT3l6RSK4IfuIzX0uadjL6');
Moralis.serverURL = 'https://hjsc4v566bn3.usemoralis.com:2053/server';
Moralis.Web3.getSigningData = () =>
	'Welcome to DeHub! To proceed securely please sign this connection.';

export let authProvider = authenticateProvider();
function authenticateProvider() {
	const $doc = $(document);
	const user = currUser();
	if (user) {
		const authProvider = new ethers.providers.Web3Provider(window.ethereum);
		if (authProvider.provider.chainId !== CHAIN_ID) {
			console.log('Unsupported chain!');
			// User is loggedin, but wrong chain on users wallet. Handle this.
			$doc.ready(() => $doc.trigger('chain:mismatch'));
		} else {
			console.log('Supported chain!');
			// Moralis user exists and provider created.
			// We can say authentication is complete. Listen to this event to update states.
			$doc.ready(() => $doc.trigger('logged:in', [user, authProvider]));
		}
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
	const $doc = $(document);
	let user = currUser();
	if (!user) {
		// Show full screen loader
		const props = ['Waiting', 'Please confirm with your wallet.'];
		$doc.ready(() => $doc.trigger('fullScreenLoader:show', props));
		try {
			const params = { provider: providerName };
			user = await Moralis.Web3.authenticate(params);
			authProvider = authenticateProvider();
		} catch (error) {
			console.log(error);
			throw error;
			// Most likely user canceled signature.
			// We just silence the error here for now. You will still see Metamask
			// error in the console, but this is better than two unhandled errors :))
		}
	}
	$doc.ready(() => $doc.trigger('fullScreenLoader:hide'));
	return user;
}

export async function logOut() {
	await Moralis.User.logOut();
	authProvider = undefined;
	const $doc = $(document);
	$doc.ready(() => $doc.trigger('logged:out'));
}

/**
 * Asks user to switch the chain if possible and if chain doesn't exist yet,
 * tries to add it to Metamask. Emits events accordingly for listeners to react.
 */
export async function askToSwitchChain() {
	console.log('Will ask to switch network!');
	const $doc = $(document);
	const prov = authProvider.provider;
	try {
		await prov.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: CHAIN_ID }],
		});
		// All good, can say authentication completed. Metamask docs recommend
		// reloading here. I tried to reload dynamically by calling 'authenticateProvider'
		// but for some reason window.ethereum does not update in time.
		// Reload will happen on chain change listener bellow.
	} catch (switchError) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError.code === 4902) {
			try {
				await prov.request({
					method: 'wallet_addEthereumChain',
					params: [{ chainId: CHAIN_ID, rpcUrl: RPC_URL }],
				});
			} catch (addError) {
				// TODO: handle "add" error by showing error alert
				$doc.ready(() => $doc.trigger('chain:mismatch'));
				$doc.ready(() => $doc.trigger('error:chain:add', [addError]));
			}
		}
		// TODO: handle other "switch" errors by showing error alert
		$doc.ready(() => $doc.trigger('error:chain:switch', [switchError]));
	}
}

export function isChainCorrect() {
	return authProvider.provider.chainId === CHAIN_ID;
}

export async function linkAccount(account) {
	console.log('Linking account: ', account);
	try {
		const user = await Moralis.Web3.link(account);
		const $doc = $(document);
		authProvider = authenticateProvider();
		$doc.ready(() => $doc.trigger('logged:in', [user, authProvider]));
	} catch (error) {
		console.log(error);
		logOut();
	}
}

/* -------------------------------- Listeners ------------------------------- */

Moralis.Web3.onAccountsChanged(async (accounts) => {
	const user = currUser();
	if (user) {
		// window.location.reload();
		const $doc = $(document);
		const acc = accounts[0];
		const isLinked = user.attributes.accounts.some((i) => i === acc);
		console.log(acc, user.attributes.accounts, isLinked);
		if (accounts.length > 0) {
			if (!isLinked) {
				$doc.ready(() => $doc.trigger('account:changed:new', [acc]));
			} else {
				authProvider = authenticateProvider();
				$doc.ready(() => $doc.trigger('account:changed:old'));
			}
		} else {
			// No accounts returned means the last account has been disconnected from the dApp
			console.log('All accounts disconnected, logging out.');
			logOut();
		}
	}
});

Moralis.Web3.onChainChanged(async () => {
	window.location.reload();
});

// TODO: handle this
function updateProviderListeners() {
	authProvider.provider.on('network', (newNetwork, oldNetwork) => {
		console.log('!!!!!!!!!!');
		console.log(newNetwork, oldNetwork);
	});

	authProvider.provider.on('connect', (connectInfo) => {
		console.log(connectInfo);
	});

	authProvider.provider.on('accountsChanged', (accounts) => {
		console.log(accounts);
		console.log(authProvider.provider.isConnected());
	});

	authProvider.provider.on('chainChanged', (chainId) => {
		console.log(chainId);
	});
}
