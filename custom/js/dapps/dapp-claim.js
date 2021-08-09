import * as ethers from '/custom/libs/ethers/ethers-5.1.esm.min.js';
import { currUser } from '../controllers/auth.js';

const abi = [
	'function isDistributionEnabled() public view returns(bool)',
	'function hasAlreadyClaimed(address holderAddr) public view returns(bool)',
	'function balanceOf(address account) public view returns(uint256)',
	'function claimCycleHours() public view returns(uint256)',
	'function claimableDistribution() public view returns(uint256)',
	'function calcClaimableShare(address holderAddr) public view returns(uint256)',
	'function totalClaimed() public view returns(uint256)',
	'function claimReward() external returns(uint256)',
];

const CONTRACT_ADDR = '0x6F2aabE11E78c6cd642689bC5896F1e4d84096aA';

// Must wrap everything in async because of Safari...
(async () => {
	let signer, signerAddr, dhb;
	let isEnabled,
		hasClaimed,
		cycleHours,
		balance,
		totalClaimable,
		claimableShare,
		totalClaimed;

	/* ----------------------------- Event listeners ---------------------------- */
	$(document).on('logged:in', async (_, user, authProvider) => {
		console.log('[DAPP-CLAIM][EVENT]: logged:in');
		await initDapp(authProvider);
	});

	$(document).on('logged:out', () => {
		console.log('[DAPP-CLAIM][EVENT]: logged:out');
		updateClaimButton();
		showConnectWallet();
	});

	$(document).on('chain:mismatch', () => {
		console.log('[DAPP-CLAIM][EVENT]: chain:mismatch');
		updateClaimButton();
		showConnectWallet();
	});

	async function initDapp(authProvider) {
		signer = authProvider.getSigner();
		signerAddr = await signer.getAddress();
		dhb = new ethers.Contract(CONTRACT_ADDR, abi, signer);
		await updateView();
		updateClaimButton();
		$('#claim-btn')
			.off()
			.on('click', () => claim());
	}

	// window.ethereum.on('accountsChanged', function (accounts) {
	// 	console.log('!!!!!!!');
	// });

	async function updateData() {
		isEnabled = await dhb.isDistributionEnabled();
		hasClaimed = await dhb.hasAlreadyClaimed(signerAddr);
		cycleHours = ethers.utils.formatUnits(await dhb.claimCycleHours(), 0);
		balance = ethers.utils.formatUnits(await dhb.balanceOf(signerAddr), 5);
		totalClaimable = ethers.utils.formatEther(
			await dhb.claimableDistribution()
		);
		claimableShare = ethers.utils.formatEther(
			await dhb.calcClaimableShare(signerAddr)
		);
		totalClaimed = ethers.utils.formatEther(await dhb.totalClaimed());

		console.log(isEnabled);
		console.log(hasClaimed);
		console.log(cycleHours);
		console.log(balance);
		console.log(totalClaimable);
		console.log(claimableShare);
		console.log(totalClaimed);
	}

	/* ----------------------------------- UI ----------------------------------- */

	async function updateView() {
		if (currUser()) {
			console.log('User exists.');
			await showDapp();
			await showLoading();
			await updateData();
			$('.current-balance').text(balance);
			$('.total-claimable').text(totalClaimable);
			$('.claimable-share').text(claimableShare);
			$('.total-claimed').text(totalClaimed);
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
		await $('#interface, #claimed-msg, #disabled-msg')
			.fadeOut('fast')
			.promise();
		await $('#dapp-connect-wallet-container').fadeOut('slow').promise();
		await $('#claim-dapp').fadeIn('slow').promise();
	}

	async function showConnectWallet() {
		await $('#claim-dapp').fadeOut('slow').promise();
		await $('#dapp-connect-wallet-container').fadeIn('slow').promise();
	}

	async function showLoading() {
		await $('#claim-btn').fadeTo('slow', 0).promise();
		await $('#interface, #claimed-msg, #disabled-msg')
			.fadeOut('slow')
			.promise();
		await $('#loading-msg').fadeIn('slow').promise();
	}

	async function showInterface() {
		await $('#claim-btn').fadeTo('slow', 1).promise();
		await $('#loading-msg, #claimed-msg, #disabled-msg')
			.fadeOut('fast')
			.promise();
		await $('#interface').fadeIn('slow').promise();
	}

	async function showDisabledMessage() {
		await $('#claim-btn').fadeTo('slow', 0).promise();
		await $('#claimed-msg, #loading-msg, #interface').fadeOut('slow').promise();
		await $('#disabled-msg').fadeIn('slow').promise();
	}

	async function showClaimedMessage() {
		await $('#claim-btn').fadeTo('slow', 0).promise();
		await $('#loading-msg, #disable-msg, #interface').fadeOut('slow').promise();
		await $('#claimed-msg').fadeIn('slow').promise();
	}

	function canClaim() {
		return currUser() && !isEnabled && !hasClaimed && balance !== '0.0';
	}

	function updateClaimButton() {
		const $claimBtn = $('#claim-btn');
		if (!canClaim()) {
			$claimBtn.addClass('disabled').removeAttr('style');
		} else {
			$claimBtn.removeClass('disabled').removeAttr('style');
		}
	}

	async function claim() {
		// currUser().destroy();
		if (hasClaimed) {
			await showClaimedMessage();
			setTimeout(async () => {
				await updateView();
			}, 2000);
		} else {
			const $claimBtn = $('#claim-btn');
			$claimBtn.addClass('disabled').find('.nonEmpty').text('Claiming...');
			try {
				const tx = await dhb.claimReward();
				tx.await();
				console.log(tx);
			} catch (error) {}
			$claimBtn.removeClass('disabled').find('.nonEmpty').text('Claim');
			await updateView();
		}
	}
})();
