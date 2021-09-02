/**
 * Moralis integration with authentication handling.
 */

import * as ethers from '/custom/libs/ethers/ethers-5.4.6.esm.min.js';
import { constants } from '../constants.js';
import { iOS } from '../helpers.js';

/* ---------------------------------- Init ---------------------------------- */

Moralis.initialize(constants.MORALIS_ID);
Moralis.serverURL = constants.MORALIS_SERVER;
Moralis.Web3.getSigningData = () =>
	'Welcome to DeHub! To proceed securely please sign this connection.';

const $doc = $(document);
let isAuthInit;
// Will store a web3 blockchain client provider (metamask, walletconnect etc.)
// It's called unauth... cause it's just a provider which we will use to wrap for
// later use with ethers.js once we authenticate with Moralis.
let unauthProvider;
// Will store web3 blockchain client provider as above, but wrapped for use with
// ethers.js once authenticated by Moralis. Use this provider for interactions
// with contracts.
export let authProvider;

/* --------------------------------- Methods -------------------------------- */

/**
 * Private method which initializes web3 provider by wrapping it for ethers.js
 * I call this "authenticated provider" cause we only wrap this for use after
 * Moralis authentication is successfull and we have a user and "unauthProvider"
 * variable (meaning there's a blockchain wallet client present.).
 * Prerequisites: user must be authenticated, and provider must be present.
 * @returns ethers.js wrapped provider ready for interactions with contracts or undefined.
 */
function authenticateProvider() {
	const user = currUser();
	if (user) {
		const authProvider = new ethers.providers.Web3Provider(unauthProvider);
		const id = authProvider.provider.chainId;
		if (id !== constants.CHAIN_ID_DEC && id !== constants.CHAIN_ID_HEX) {
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

/**
 * Do your pre-moralis and other logic here. (E.x. read data from local storage)
 * @returns Returns early if already init, to prevent duplicate calls.
 */
export async function initAuth() {
	if (isAuthInit) return;
	if (Moralis.User.current()) {
		console.log('User exists. Authenticate provider.');
		try {
			// Resolve providerName by checking if saved locally.
			const savedProviderName = window.localStorage.getItem('providerName');
			const params = { chainId: constants.CHAIN_ID_DEC };
			savedProviderName ? (params['provider'] = savedProviderName) : undefined;
			// Once params are prepared, allow Moralis to enable the provider.
			// If Walletconnect is used, Moralis will prepare it as expected using localstorage
			// object created by walletconnect sdk.
			await Moralis.Web3.enable(params);
			const web3 = await Moralis.Web3.activeWeb3Provider.activate();
			// Our web3 provider is ready, but it's not done yet...
			unauthProvider = await web3.currentProvider;
			// We will wrap it for use with ethers.js and trigger events.
			authProvider = authenticateProvider();
		} catch (error) {
			console.log(error);
		}
		// Check if we haven't just reloaded the window for chain change.
		if (window.localStorage.getItem('chainChange')) {
			// If so, then clean up and login.
			window.localStorage.removeItem('chainChange');
			await logIn();
		}
	} else {
		console.log('User does not exist. Pass...');
	}
	isAuthInit = true;
}

/**
 * Returns Moralis authenticated user if possible.
 * * Note: Before actually getting the user we should check if any web3 provider
 * * exists at all, otherwise there is no point to go further.
 * @returns User object or undefined.
 */
export function currUser() {
	if (unauthProvider) {
		const user = Moralis.User.current();
		console.log('User:', user);
		return user;
	} else {
		return undefined;
	}
}

/**
 * Resolves the providerName from param or local storage and proceeds with login
 * process using Moralis. Updates the web3 provider as well.
 * @param {*} providerName (optional)
 */
export async function logIn(providerName) {
	// Resolve providerName by checking if passed via property, or saved locally.
	const savedProviderName = window.localStorage.getItem('providerName');
	if (!providerName && !savedProviderName) throw 'Need a provider name!';
	providerName = providerName || savedProviderName;
	// Save so we can re-login on page refresh.
	window.localStorage.setItem('providerName', providerName);
	// Proceed with login...
	let user = currUser();
	if (!user) {
		// Show full screen loader
		const props = ['Waiting', 'Please confirm with your wallet.'];
		$doc.ready(() => $doc.trigger('fullScreenLoader:show', props));
		try {
			const params = {
				provider: providerName,
				chainId: constants.CHAIN_ID_DEC,
			};
			user = await Moralis.Web3.authenticate(params);
			const web3 = await Moralis.Web3.activeWeb3Provider.activate();
			unauthProvider = await web3.currentProvider;
			authProvider = authenticateProvider();
			if (!isChainCorrect()) {
				await askToSwitchChain();
			}
		} catch (error) {
			console.log(error);
			// Most likely user canceled signature.
			// We just silence the error here for now. You will still see Metamask
			// error in the console, but this is better than two unhandled errors :))
		}
	}
	$doc.ready(() => $doc.trigger('fullScreenLoader:hide'));
	return user;
}

/**
 * Logout from Moralis, clear the authProvider wrapper and notify all listeners.
 */
export async function logOut() {
	const props = ['Logging out', 'Good bye...'];
	$doc.ready(() => $doc.trigger('fullScreenLoader:show', props));
	await Moralis.User.logOut();
	authProvider = undefined;
	$doc.ready(() => $doc.trigger('fullScreenLoader:hide'));
	$doc.ready(() => $doc.trigger('logged:out'));
}

/**
 * Asks user to switch the chain if possible and if chain doesn't exist yet,
 * tries to add it to Metamask. Emits events accordingly for listeners to react.
 */
export async function askToSwitchChain() {
	console.log('Will ask to switch network!');
	const props = ['Waiting', 'Please confirm network switch with your wallet.'];
	$doc.ready(() => $doc.trigger('fullScreenLoader:show', props));

	const prov = authProvider.provider;
	try {
		await prov.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: constants.CHAIN_ID_HEX }],
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
					params: [
						{ chainId: constants.CHAIN_ID_HEX, rpcUrl: constants.RPC_URL },
					],
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
	$doc.ready(() => $doc.trigger('fullScreenLoader:hide'));
}

export function isChainCorrect() {
	const id = authProvider.provider.chainId;
	return id === constants.CHAIN_ID_HEX || id === constants.CHAIN_ID_DEC;
}

/**
 * Allows to link an account to an existing Moralis user.
 * Updates the authProvider as well.
 * If user cancels linking, we just logout.
 * @param {*} account new account to be linked.
 */
export async function linkAccount(account) {
	console.log('Linking account: ', account);
	const props = ['Waiting', 'Please confirm account linking with your wallet.'];
	$doc.ready(() => $doc.trigger('fullScreenLoader:show', props));
	try {
		const user = await Moralis.Web3.link(account);
		authProvider = authenticateProvider();
		$doc.ready(() => $doc.trigger('logged:in', [user, authProvider]));
	} catch (error) {
		console.log(error);
		logOut();
	}
	$doc.ready(() => $doc.trigger('fullScreenLoader:hide'));
}

/**
 * This will let us know that chainChange has been called previously and initiate
 * automatic re-authorization.
 */
function reloadForChainChange() {
	window.localStorage.setItem('chainChange', true);
	window.location.reload();
}

/* -------------------------------- Listeners ------------------------------- */

Moralis.Web3.onAccountsChanged(async (accounts) => {
	const user = currUser();
	if (user) {
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
	// If in focus reload and re-login, if not then wait until in focus.
	document.hasFocus()
		? reloadForChainChange()
		: $(window).focus(() => reloadForChainChange());
});

// Hack to avoid trustwallet redirecting to a open in app website on iOS...
// Ref: https://github.com/WalletConnect/walletconnect-monorepo/issues/552
$doc.on('visibilitychange', () => {
	if (document.visibilityState === 'hidden' && iOS()) {
		window.localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
	}
});
