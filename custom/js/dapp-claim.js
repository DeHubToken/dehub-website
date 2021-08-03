import * as ethers from '/custom/libs/ethers/ethers-5.1.esm.min.js';
const abi = [
	'function isDistributionEnabled() public view returns(bool)',
	'function balanceOf(address account) public view returns(uint256)',
	'function claimCycleHours() public view returns(uint256)',
	'function claimableDistribution() public view returns(uint256)',
	'function calcClaimableShare(address holderAddr) public view returns(uint256)',
	'function claimReward() external returns(uint256)',
];

const CONTRACT_ADDR = '0x6F2aabE11E78c6cd642689bC5896F1e4d84096aA';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const signerAddr = await signer.getAddress();
const dhb = new ethers.Contract(CONTRACT_ADDR, abi, signer);

let isEnabled, cycleHours, balance, totalClaimable, claimableShare;

async function updateData() {
	isEnabled = await dhb.isDistributionEnabled();
	cycleHours = ethers.utils.formatUnits(await dhb.claimCycleHours(), 0);
	balance = ethers.utils.formatUnits(await dhb.balanceOf(signerAddr), 5);
	totalClaimable = ethers.utils.formatEther(await dhb.claimableDistribution());
	claimableShare = ethers.utils.formatEther(
		await dhb.calcClaimableShare(signerAddr)
	);
	console.log(isEnabled);
	console.log(cycleHours);
	console.log(balance);
	console.log(totalClaimable);
	console.log(claimableShare);
}

/* ----------------------------------- UI ----------------------------------- */

async function updateView() {
	await updateData();
	$('.current-balance').text(balance);
	$('.total-claimable').text(totalClaimable);
	$('.claimable-share').text(claimableShare);
}

function updateClaimButton() {
	const $claimBtn = $('#claim-btn');
	if (!isEnabled) {
		$claimBtn.addClass('disabled');
	} else {
		$claimBtn.removeClass('disabled');
	}
}

async function claim() {
	const $claimBtn = $('#claim-btn');
	$claimBtn.addClass('disabled').find('.nonEmpty').text('Claiming...');
	try {
		const tx = await dhb.claimReward();
		tx.await();
		console.log(tx);
	} catch (error) {}
	await updateView();
	$claimBtn.removeClass('disabled').find('.nonEmpty').text('Claim');
}

await updateView();
updateClaimButton();
$('#claim-btn').on('click', () => claim());
