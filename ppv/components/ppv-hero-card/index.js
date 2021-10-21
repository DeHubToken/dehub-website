import { constants } from '../../../custom/js/constants.js';
import { countDown } from '../../../custom/js/helpers.js';

// Fetch template and update the DOM
fetch('/ppv/components/ppv-hero-card/template.html')
	.then((response) => response.text())
	.then((data) => initPPVHeroCard(data));

async function initPPVHeroCard(data) {
	const client = contentful.createClient({
		// This is the space ID. A space is like a project folder in Contentful terms
		space: '4jicnfvodfm8',
		// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
		accessToken: constants.CONTENTFUL_KEY,
	});
	// Update DOM
	const $component = $('ppv-hero-card');
	$component.html(data);

	// Get the data
	const response = await client.getEntries({
		content_type: 'ppv',
		'fields.featured': true,
		order: '-fields.date',
	});
	const items = response.items;
	// console.log(items);
	items.forEach((item) => {
		if (item.fields.featured) {
			updateCoverData(item, $component);
		}
	});
}

/**
 * Will update the main cover card element.
 */
function updateCoverData(item, $component) {
	const f = item.fields;
	// Cover image and body background
	const image = f.coverImage.fields.file.url;
	$component.find('img')[0].src = image;
	$('body').css(
		'background',
		'linear-gradient(45deg, rgba(11, 17, 19, 0.9), rgba(5, 17, 24, 0.9) 46%, rgba(6, 12, 29, 1) 71%, rgba(50, 19, 56, 1)), url("' +
			image +
			'") no-repeat fixed center center /cover'
	);
	// Title
	$component.find('.card-title').text(f.title);
	// Date and countdown
	if (f.date) {
		const d = new Date(f.date);
		$component.find('.date').text(d.toUTCString().replace('GMT', 'UTC'));
		const x = setInterval(countDown, 1000, $component, d);
		$component
			.find('.date-container, .countdown-container')
			.toggleClass('d-none d-block');
	}
	// Badge
	if (f.badge && f.badge !== '') {
		$component.find('.badge').text(f.badge).toggleClass('d-none d-block');
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
	const converted = $(
		documentToHtmlString(f.description, richOptions)
	).toArray();
	const pLen = converted.length;
	const firstParagraph = converted.shift();
	$component.find('.description-first-p').html(firstParagraph);
	if (pLen > 1) {
		const html = $.parseHTML(readMoreBtnTemplate);
		$component.find('.description-first-p p').append($(html));
		$component.find('.description-rest').html(converted);
	}
	// Button
	if (f.callToActionButtonLabel) {
		const $cta = $component.find('.ppv-cta');
		$cta
			.removeClass('d-none')
			.find('.nonEmpty')
			.text(f.callToActionButtonLabel);
		if (f.callToActionButtonLink) {
			$cta.attr('href', f.callToActionButtonLink).removeClass('disabled');
		}
	}
}

const readMoreBtnTemplate = `
	<a href="#collapseDescription"
		role="button"
		class="link read-more d-inline badge badge-dark"
		data-toggle="collapse"
		aria-expanded="false"
		aria-controls="collapseDescription">
		<span>Read more&nbsp;<i class="far fa-chevron-down"></i></span>
	</a>
`;
