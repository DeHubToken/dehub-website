/**
 * Moralis integration
 */
Moralis.initialize('4VxfmspNNL6kh39h2pleJx9nuN2YGKbvoFXPofcX');
Moralis.serverURL = 'https://phcmjyh5no3n.usemoralis.com:2053/server';
Moralis.Web3.getSigningData = () =>
	'Welcome to DeHub! To proceed securely please sign this connection.';

export function currUser() {
	const user = Moralis.User.current();
	console.log('User:', user);
	return user;
}

export async function logIn() {
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

export async function logOut() {
	await Moralis.User.logOut();
	console.log('logged out');
}

Moralis.Web3.onAccountsChanged(async (accounts) => {
	const confirmed = confirm(
		'Do you want to link this address to your account?'
	);
	if (confirmed) {
		await Moralis.Web3.link(accounts[0]);
	}
});
