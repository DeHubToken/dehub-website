import * as ethers from '/custom/libs/ethers/ethers-5.1.esm.min.js';
import { currUser } from '../controllers/auth.js';

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

// MAINNET
// const CONVERTIBLE_CONTRACT_ADDR = '0x66a7dCCb7F293f4D9bEC1918079282D497210e8f';
// const SWAP_CONTRACT_ADDR = '0x4d632662e1A2CF33Bb6d3BeA2fbc3C996E4b1291';
// const PUBLIC_CONTRACT_ADDR = '0xEbfFff1Ce706B4c2bA62192136BAC67cDAD251F6';
// TESTNET
const CONVERTIBLE_CONTRACT_ADDR = '0x3b1fba25801271ada626643084fac6dcffabc680';
const SWAP_CONTRACT_ADDR = '0x976d01469Ee9870717410ECD7B0E9e8620dA94B4';
const PUBLIC_CONTRACT_ADDR = '0x7231f507a8878D684b9cDcb7550C0246977E0C55';

// Must wrap everything in async because of Safari...
(async () => {
	const $doc = $(document);
	const $actionBtn = $('#action-btn');
	$actionBtn.fadeTo(0, 0);

	let isSwapping = false;
	let isApproving = false;
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
		await updateActionButton();
	}

	async function updateData() {
		isEnabled = await dhbSwap.isEnabled();
		// hasClaimed = await dhb.hasAlreadyClaimed(signerAddr);
		// cycleHours = ethers.utils.formatUnits(await dhb.claimCycleHours(), 0);
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
		// totalClaimable = ethers.utils.formatEther(
		// 	await dhb.claimableDistribution()
		// );
		// claimableShare = ethers.utils.formatEther(
		// 	await dhb.calcClaimableShare(signerAddr)
		// );
		// totalClaimed = ethers.utils.formatEther(await dhb.totalClaimed());
		console.log(isEnabled);
		// console.log(hasClaimed);
		// console.log(cycleHours);
		console.log(balanceCon);
		console.log(balancePub);
		// console.log(totalClaimable);
		// console.log(claimableShare);
		// console.log(totalClaimed);
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
			// Handle exceptions
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
		await $('#loading-msg, #disabled-msg').fadeOut('fast').promise();
		await $('#interface').fadeIn('slow').promise();
	}

	async function showDisabledMessage() {
		await $actionBtn.fadeTo('slow', 0).promise();
		await $('#loading-msg, #interface').fadeOut('slow').promise();
		await $('#disabled-msg').fadeIn('slow').promise();
	}

	function canApprove() {
		const can = currUser() && isEnabled && balanceCon !== '0.0';
		console.log('Can approve:', can);
		return can;
	}

	async function canSwap() {
		// Only if approved
		const can =
			currUser() && isEnabled && balanceCon !== '0.0' && allowanceCon !== '0.0';
		console.log('Can swap:', can);
		return can;
	}

	async function updateActionButton() {
		if (await canSwap()) {
			$actionBtn.find('.nonEmpty').text('Swap');
			await $actionBtn.fadeTo('slow', 1).promise();
			$actionBtn.removeClass('disabled').removeAttr('style');
			$actionBtn.off().on('click', () => swap());
		} else if (canApprove()) {
			$actionBtn.find('.nonEmpty').text('Approve Swap');
			await $actionBtn.fadeTo('slow', 1).promise();
			$actionBtn.removeClass('disabled').removeAttr('style');
			$actionBtn.off().on('click', () => approve());
		} else {
			await $actionBtn.fadeTo('slow', 0).promise();
			$actionBtn.find('.nonEmpty').text('...');
			$swapBtn.addClass('disabled').removeAttr('style');
			$actionBtn.off();
		}
	}
})();
