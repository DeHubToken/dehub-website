const client = contentful.createClient({
	// This is the space ID. A space is like a project folder in Contentful terms
	space: '4jicnfvodfm8',
	// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
	accessToken: 'KcnbJh6OlDNIeAD3BmpkwwEbnPla9E_CWytSW4yaRBs',
});

// Fetch template and update the DOM
fetch('/tournaments/components/tournament-hero-card/template.html')
	.then((response) => response.text())
	.then((data) => initTournamentHeroCard(data));

async function initTournamentHeroCard(data) {
	// Update DOM
	const $component = $('tournament-hero-card');
	$component.html(data);

	// Get the data
	const response = await client.getEntries();
	const items = response.items;
	items.forEach((item, index) => {
		if (index === 0) {
			updateCoverData(item, $component);
		}
	});
}

/**
 * Will update the main cover card element.
 */
function updateCoverData(item, $component) {
	const f = item.fields;
	const locale = item.sys.locale;
	// Cover image
	$component.find('img')[0].src = f.coverImage.fields.file.url;
	// Title
	$component.find('.card-title').text(f.title);
	// Date and countdown
	const d = new Date(f.date);
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timezone: 'UTC',
		timeZoneName: 'short',
	};
	$component.find('.date').text(d.toLocaleDateString(locale, options));
	const x = setInterval(countDown, 1000, $component, d);
	// Badge
	if (f.badge && f.badge !== '') {
		$component.find('.badge').text(f.badge).toggleClass('d-none, d-block');
	}
	// Description
	const richOptions = {
		renderNode: {
			[BLOCKS.HEADING_5]: (node, next) =>
				`<h5 class="pt-15">${next(node.content)}</h5>`,
			[BLOCKS.HEADING_6]: (node, next) =>
				`<h6 class="pt-10">${next(node.content)}</h6>`,
			[BLOCKS.UL_LIST]: (node, next) =>
				`<ul class="pt-10">${next(node.content)}</ul>`,
			[BLOCKS.LIST_ITEM]: (node, next) => {
				const content = next(node.content)
					.replace('<p>', '')
					.replace('</p>', '');
				return `<li>${content}</li>`;
			},
		},
	};
	const converted = documentToHtmlString(f.description, richOptions);
	$component.find('.description').html(converted);
	// Button
	const $cta = $component.find('.tournament-cta');
	$cta.find('.nonEmpty').text(f.callToActionButtonLabel);
	if (f.callToActionButtonLink) {
		$cta.attr('href', f.callToActionButtonLink).removeClass('disabled');
	}
}

/**
 * Will update slider components.
 */
function updateSliderData(fields) {}

function countDown($component, countDownDate) {
	const $countdown = $component.find('.countdown');
	// Get today's date and time
	const now = new Date().getTime();

	// Find the distance between now and the count down date
	const distance = countDownDate - now;

	// Time calculations for days, hours, minutes and seconds
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Display the result in the element with id="demo"
	$countdown.text(
		days +
			' day(s) ' +
			hours +
			' hours ' +
			minutes +
			' minutes ' +
			seconds +
			' seconds '
	);

	// If the count down is finished, write some text
	if (distance < 0) {
		clearInterval(x);
		$countdown.text('Started!');
	}
}
