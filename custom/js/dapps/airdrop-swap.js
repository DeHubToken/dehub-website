import * as ethers from '/custom/libs/ethers/ethers-5.4.6.esm.min.js';
import { currUser } from '../controllers/auth.js';
import { constants } from '../constants.js';

const abiCon = [
	'function balanceOf(address account) public view returns(uint256)',
	'function approve(address spender, uint256 amount) external returns (bool)',
	'function allowance(address, address) public view returns(uint256)',
];

const abiSwap = [
	'function isEnabled() public view returns(bool)',
	'function swap(uint amount) external',
];

const abiPub = [
	'function balanceOf(address account) public view returns(uint256)',
];

const CONVERTIBLE_CONTRACT_ADDR = constants.CONVERTIBLE_CONTRACT;
const SWAP_CONTRACT_ADDR = constants.SWAP_CONTRACT;
const PUBLIC_CONTRACT_ADDR = constants.PUBLIC_CONTRACT;

// Must wrap everything in async because of Safari...
(async () => {
	const $doc = $(document);
	const $actionBtn = $('#action-btn');
	const $swapSuccessMsg = $('#swapSuccessMessage');
	$actionBtn.fadeTo(0, 0);
	$swapSuccessMsg.fadeTo(0, 0);
	// Chain variables
	let signer, signerAddr, dhbCon, dhbSwap, dhbPub;
	let isEnabled, balanceCon, balancePub, allowanceCon;

	/* ----------------------------- Event listeners ---------------------------- */
	$doc.on('logged:in', async (_, user, authProvider) => {
		console.log('[DAPP-SWAP][EVENT]: logged:in');
		await initDapp(authProvider);
	});

	$doc.on('logged:out', async () => {
		console.log('[DAPP-SWAP][EVENT]: logged:out');
		await updateActionButton();
		await showConnectWallet();
	});

	$doc.on('chain:mismatch', async () => {
		console.log('[DAPP-SWAP][EVENT]: chain:mismatch');
		await updateActionButton();
		await showConnectWallet();
	});

	async function initDapp(authProvider) {
		signer = authProvider.getSigner();
		signerAddr = await signer.getAddress();
		// Contracts
		dhbCon = new ethers.Contract(CONVERTIBLE_CONTRACT_ADDR, abiCon, signer);
		dhbSwap = new ethers.Contract(SWAP_CONTRACT_ADDR, abiSwap, signer);
		dhbPub = new ethers.Contract(PUBLIC_CONTRACT_ADDR, abiPub, signer);
		// Render
		await updateView();
	}

	async function updateData() {
		isEnabled = await dhbSwap.isEnabled();
		balanceCon = ethers.utils.formatUnits(
			await dhbCon.balanceOf(signerAddr),
			5
		);
		balancePub = ethers.utils.formatUnits(
			await dhbPub.balanceOf(signerAddr),
			5
		);
		allowanceCon = ethers.utils.formatUnits(
			await dhbCon.allowance(signerAddr, dhbSwap.address),
			5
		);
		console.log(isEnabled);
		console.log(balanceCon);
		console.log(balancePub);
	}

	/* ----------------------------------- UI ----------------------------------- */

	async function updateView() {
		if (currUser()) {
			console.log('User exists.');
			await showDapp();
			await showLoading();
			await updateData();
			$('.current-balance-con').text(balanceCon);
			$('.current-balance-pub').text(balancePub);
			await updateActionButton();
			// Handle exceptions and other states
			if (!isEnabled) {
				await showDisabledMessage();
			} else {
				await showInterface();
			}
		} else {
			console.log('User does not exist.');
			await showConnectWallet();
		}
	}

	async function showDapp() {
		await $('#interface, #disabled-msg').fadeOut('fast').promise();
		await $('#dapp-connect-wallet-container').fadeOut('slow').promise();
		await $('#airdrop-swap-dapp').fadeIn('slow').promise();
	}

	async function showConnectWallet() {
		await $('#airdrop-swap-dapp').fadeOut('slow').promise();
		await $('#dapp-connect-wallet-container').fadeIn('slow').promise();
	}

	async function showLoading(title, subtitle) {
		const defaultTitle = 'Syncing with $DeHub Contract';
		const defaultSubtitle = 'Please give it a second.';
		$('.loader-title').text(title || defaultTitle);
		$('.loader-subtitle').text(subtitle || defaultSubtitle);
		await $actionBtn.fadeTo('slow', 0).promise();
		await $('#interface, #disabled-msg').fadeOut('slow').promise();
		await $('#loading-msg').fadeIn('slow').promise();
	}

	async function showInterface() {
		if (didSwap()) {
			await $swapSuccessMsg.fadeTo('fast', 1).promise();
		} else {
			await $swapSuccessMsg.fadeTo('fast', 0).promise();
		}
		await $('#loading-msg, #disabled-msg').fadeOut('fast').promise();
		await $('#interface').fadeIn('slow').promise();
	}

	async function showDisabledMessage() {
		await $actionBtn.fadeTo('slow', 0).promise();
		await $('#loading-msg, #interface').fadeOut('slow').promise();
		await $('#disabled-msg').fadeIn('slow').promise();
	}

	async function initApproveSwapButton() {
		$actionBtn.find('.nonEmpty').text('Approve Swap');
		$actionBtn
			.removeClass('disabled')
			.removeClass('glass-1')
			.addClass('glass-2')
			.removeAttr('style');
		await $actionBtn.fadeTo('slow', 1).promise();
		$actionBtn.off().on('click', (e) => approve(e));
	}

	async function initSwapButton() {
		$actionBtn.find('.nonEmpty').text('Swap');
		$actionBtn
			.removeClass('disabled')
			.removeClass('glass-2')
			.addClass('glass-1')
			.removeAttr('style');
		await $actionBtn.fadeTo('slow', 1).promise();
		$actionBtn.off().on('click', (e) => swap(e));
	}

	async function killActionButton() {
		await $actionBtn.fadeTo('slow', 0).promise();
		$actionBtn.find('.nonEmpty').text('...');
		$actionBtn.addClass('disabled');
		$actionBtn.off();
	}

	function canApprove() {
		const maxApprove = ethers.utils.formatUnits(800000000000000, 5);
		const can =
			currUser() &&
			isEnabled &&
			balanceCon !== maxApprove &&
			balanceCon !== '0.0';
		console.log('Can approve:', can);
		return can;
	}

	function canSwap() {
		// Only if approved
		const maxApprove = ethers.utils.formatUnits(800000000000000, 5);
		const can =
			currUser() &&
			isEnabled &&
			balanceCon !== '0.0' &&
			allowanceCon === maxApprove;
		console.log('Can swap:', can);
		return can;
	}

	function didSwap() {
		// We assume this, if user has 0 convertible and some public.
		const did =
			currUser() && isEnabled && balanceCon === '0.0' && balancePub !== '0.0';
		console.log('Did swap:', did);
		return did;
	}

	async function updateActionButton() {
		if (canSwap()) {
			await initSwapButton();
		} else if (canApprove()) {
			await initApproveSwapButton();
		} else {
			await killActionButton();
		}
	}

	async function approve(e) {
		e.preventDefault();
		console.log('Approve.');
		await showLoading('Approving Swap', 'Please confirm with your wallet.');
		try {
			// const balanceConRaw = await dhbCon.balanceOf(signerAddr);
			const maxApprove = 800000000000000;
			const tx = await dhbCon.approve(dhbSwap.address, maxApprove);
			await showLoading(
				'Waiting for confirmation',
				'Stay with us for a few seconds.'
			);
			await tx.wait();
		} catch (error) {
			// Most likely user rejected approval.
			console.log(error);
		}
		await updateView();
	}

	async function swap(e) {
		e.preventDefault();
		console.log('Swap.');
		await showLoading('Swapping', 'Please confirm with your wallet.');
		try {
			const balanceConRaw = await dhbCon.balanceOf(signerAddr);
			const tx = await dhbSwap.swap(balanceConRaw);
			await showLoading(
				'Swapping in progress',
				'Please wait for swap to complete.'
			);
			await tx.wait();
		} catch (error) {
			// Most likely user rejected swap.
			console.log(error);
		}
		await updateView();
	}
})();
