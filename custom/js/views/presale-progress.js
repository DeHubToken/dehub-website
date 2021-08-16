import * as ethers from '/custom/libs/ethers/ethers-5.1.esm.min.js';

const $doc = $(document);
const $raisedBnb = $('.raisedBnb');
const $capNormal = $('.cap-normal');
const $capSoft = $('.cap-soft');
const softCap = ethers.utils.parseEther('6000.0');
const hardCap = ethers.utils.parseEther('9000.0');

const presaleBalance = (
	await (
		await fetch(
			'https://deep-index.moralis.io/api/v2/0x399f3624A01Af08f224D48C09Fb3BAE4050cE211/balance?chain=bsc',
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key':
						'THUKACAJqdl6d2IbCSq000sLKaMJqVppgUgryr11RlqivH7QDM9LjhYosP7BfnLu',
				},
			}
		)
	).json()
).balance;

const balanceFormatted = ethers.utils.formatEther(presaleBalance);
const softX = ((presaleBalance * 100) / softCap) * 1000;
const hardX = ((presaleBalance * 100) / (hardCap - softCap)) * 100;

console.log(softX);
console.log(hardX);

$doc.ready(() => {
	$raisedBnb.text(balanceFormatted);
	if (softX < 100) {
		$capNormal.attr('aria-valuenow', softX).css('width', `${softX}%`);
	} else {
		$capNormal.attr('aria-valuenow', 66.666).css('width', `66.666%`);
		if (hardX < 100) {
			$capSoft.attr('aria-valuenow', hardX).css('width', `${hardX}%`);
		} else {
			$capSoft.attr('aria-valuenow', 100).css('width', `100%`);
		}
	}
});
