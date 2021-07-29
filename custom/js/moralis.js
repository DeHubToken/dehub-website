$(document).ready(function () {
	moralisInit();
});

function moralisInit() {
	Moralis.initialize('gpNiEhi3L1EL2xQmkFxCFOpOAXjdLxAyFnZ5TDZ7');
	Moralis.serverURL = 'https://da0aomzbpucr.usemoralis.com:2053/server';
}

function currUser() {
	const user = Moralis.User.current();
	return user;
}

async function logIn() {
	let user = currUser();
	if (!user) {
		user = await Moralis.Web3.authenticate();
	}
	console.log('logged in user:', user);
	return user;
}

async function logOut() {
	await Moralis.User.logOut();
	console.log('logged out');
}

$('.btn-connect-wallet').on('click', async (e) => {
	e.preventDefault();
	const $that = $(e.target);
	const $label = $that.first('btn-connect-wallet-label');
	console.log($label);
	const user = currUser();
	console.log(user);
	if (user) {
		// If logged-in -> logout
		await logOut();
		$that.toggleClass('btn-logged-in btn-logged-out');
	} else {
		// If not logged-in -> login
		await logIn();
		$that.toggleClass('btn-logged-out btn-logged-in');
		$label.text('Hello!');
	}
});
