$(document).ready(function () {
	MY_scripts();
});

function MY_scripts() {
	console.log('MY Scripts initialized!');

	/* -------------------------------- Variables ------------------------------- */
	let pieHeight = 700;
	let pieWidth = 800;

	/* ------------------------------- Screen Size ------------------------------ */
	let debounce = undefined;
	const screen = new ScreenSizeDetector();
	screen.setMainCallback('widthchange', () => {
		clearTimeout(debounce);
		debounce = setTimeout(() => {
			resizePie(screen.width);
		}, 500);
	});

	/* -------------------------------- Piechart -------------------------------- */

	let pieProps = {
		header: {
			title: {
				fontSize: 22,
				font: 'verdana',
				text: '',
				color: '#ffffff',
			},
			subtitle: {
				color: '#ffffff',
				fontSize: 18,
				font: 'verdana',
			},
			titleSubtitlePadding: 5,
			location: 'pie-center',
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
			pieInnerRadius: '64%',
			pieOuterRadius: '66%',
		},
		data: {
			content: [
				{
					label: 'Team',
					value: 10,
					color: '#62C8CE',
				},
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
			],
		},
		labels: {
			outer: {
				format: 'label-percentage2',
				pieDistance: 55,
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
	};
	let pie;

	function resizePie(screenWidth) {
		pie ? pie.destroy() : undefined;
		if (screenWidth <= 991 && screenWidth > 767) {
			pieProps.size.canvasHeight = 650;
			pieProps.size.canvasWidth = 750;
			pieProps.labels.mainLabel.fontSize = 12;
			pieProps.labels.percentage.fontSize = 10;
			pieProps.labels.outer.pieDistance = 55;
			pie = new d3pie('pieChart', pieProps);
		} else if (screenWidth <= 767 && screenWidth > 575) {
			pieProps.size.canvasHeight = 450;
			pieProps.size.canvasWidth = 550;
			pieProps.labels.mainLabel.fontSize = 12;
			pieProps.labels.percentage.fontSize = 10;
			pieProps.labels.outer.pieDistance = 55;
			pie = new d3pie('pieChart', pieProps);
		} else if (screenWidth <= 575 && screenWidth > 420) {
			pieProps.size.canvasHeight = 300;
			pieProps.size.canvasWidth = 400;
			pieProps.labels.mainLabel.fontSize = 12;
			pieProps.labels.percentage.fontSize = 10;
			pieProps.labels.outer.pieDistance = 25;
			pie = new d3pie('pieChart', pieProps);
		} else if (screenWidth <= 420) {
			pieProps.size.canvasHeight = 220;
			pieProps.size.canvasWidth = 320;
			pieProps.labels.mainLabel.fontSize = 10;
			pieProps.labels.percentage.fontSize = 8;
			pieProps.labels.outer.pieDistance = 15;
			pie = new d3pie('pieChart', pieProps);
		} else if (screenWidth > 991) {
			pieProps.size.canvasHeight = 700;
			pieProps.size.canvasWidth = 800;
			pieProps.labels.mainLabel.fontSize = 16;
			pieProps.labels.percentage.fontSize = 12;
			pieProps.labels.outer.pieDistance = 55;
			pie = new d3pie('pieChart', pieProps);
		}
	}
	// Call once on load
	resizePie(screen.width);

	// Listen for scroll in
	$(document).on('aos:in:pie-in', () => {
		resizePie(screen.width);
	});
}
