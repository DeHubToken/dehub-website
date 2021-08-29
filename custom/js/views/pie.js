/**
 * 3D Pie chart customizations and scripts
 */
$(document).ready(() => {
	let pieHeight = 700;
	let pieWidth = 800;

	let debounce = undefined;
	const screen = new ScreenSizeDetector();
	screen.setMainCallback('widthchange', () => {
		clearTimeout(debounce);
		debounce = setTimeout(() => {
			resizePie(screen.width);
		}, 500);
	});

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
					label: 'Presale & LP',
					value: 30,
					color: '#972595',
				},
				{
					label: 'Operations',
					value: 10,
					color: '#9C52D9',
				},
				{
					label: 'Team',
					value: 10,
					color: '#765DDE',
				},
				{
					label: 'Burned',
					value: 50,
					color: '#645ABD',
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
});
