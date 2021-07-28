$(document).ready(function () {
	MY_scripts();
});

function MY_scripts() {
	console.log('MY Scripts initialized!');

	/* -------------------------------- Variables ------------------------------- */
	let pieHeight = 700;
	let pieWidth = 800;

	/* ------------------------------- Screen Size ------------------------------ */
	const screen = new ScreenSizeDetector();
	screen.setMainCallback('widthchange', () => {
		resizePie(screen.width);
	});

	/* -------------------------------- Piechart -------------------------------- */

	function resizePie(screenWidth) {
		const props = {
			canvasHeight: 700,
			canvasWidth: 800,
			pieInnerRadius: '44%',
			pieOuterRadius: '66%',
		};
		if (screenWidth <= 1240) {
			props.canvasHeight = 500;
			canvasWidth = 600;
			pie.updateProp('size', props);
		} else if (screenWidth > 1240) {
			props.canvasHeight = 700;
			canvasWidth = 800;
			pie.updateProp('size', props);
		}
	}

	const pie = new d3pie('pieChart', {
		header: {
			title: {
				fontSize: 22,
				font: 'verdana',
			},
			subtitle: {
				color: '#999999',
				fontSize: 10,
				font: 'verdana',
			},
			titleSubtitlePadding: 12,
		},
		footer: {
			color: '#999999',
			fontSize: 11,
			font: 'open sans',
			location: 'bottom-center',
		},
		size: {
			canvasHeight: 700,
			canvasWidth: 800,
			pieInnerRadius: '44%',
			pieOuterRadius: '66%',
		},
		data: {
			content: [
				{
					label: 'Airdrop',
					value: 18,
					color: '#449293',
				},
				{
					label: 'Public & Private Sale',
					value: 25,
					color: '#3C1C44',
				},
				{
					label: 'Liquidity Pool',
					value: 15,
					color: '#552660',
				},
				{
					label: 'Burnt',
					value: 2,
					color: '#853895',
				},
				{
					label: 'Marketing',
					value: 10,
					color: '#866C8F',
				},
				{
					label: 'R&D',
					value: 10,
					color: '#B1CDCF',
				},
				{
					label: 'Partnerships & Licensing',
					value: 10,
					color: '#8FCFD4',
				},
				{
					label: 'Team',
					value: 10,
					color: '#62C8CE',
				},
			],
		},
		labels: {
			outer: {
				format: 'label-percentage2',
				pieDistance: 25,
			},
			inner: {
				format: 'none',
			},
			mainLabel: {
				color: '#ffffff',
				font: 'verdana',
				fontSize: 16,
			},
			percentage: {
				color: '#e1e1e1',
				font: 'verdana',
				decimalPlaces: 0,
				fontSize: 12,
			},
			value: {
				color: '#ebebeb',
				font: 'verdana',
			},
			lines: {
				enabled: true,
				style: 'straight',
				color: '#eeeeee',
			},
			truncation: {
				enabled: true,
			},
		},
		tooltips: {
			enabled: true,
			type: 'placeholder',
			string: '{label}: {percentage}%',
			styles: {
				backgroundOpacity: 0.67,
				font: 'verdana',
				fontSize: 16,
			},
		},
		effects: {
			pullOutSegmentOnClick: {
				effect: 'linear',
				speed: 400,
				size: 8,
			},
		},
	});

	$(document).on('aos:in:pie-in', () => {
		resizePie(screen.width);
	});
}
