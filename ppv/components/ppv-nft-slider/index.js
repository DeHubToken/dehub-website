import { constants } from '../../../custom/js/constants.js';

// Fetch template and update the DOM
fetch('/ppv/components/ppv-nft-slider/template.html')
	.then((response) => response.text())
	.then((data) => initPPVNFTSlider(data));

async function initPPVNFTSlider(data) {
	const client = contentful.createClient({
		// This is the space ID. A space is like a project folder in Contentful terms
		space: '4jicnfvodfm8',
		// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
		accessToken: constants.CONTENTFUL_KEY,
	});
	// Update DOM
	const $component = $('ppv-nft-slider');
	$component.html(data);

	// Prepare Carousel
	const rootNode = document.querySelector('.embla.nft');
	const viewportNode = rootNode.querySelector('.embla__viewport');
	const options = {
		loop: false,
		align: 0,
	};

	const embla = EmblaCarousel(viewportNode, options);
	const prevButtonNode = rootNode.querySelector('.embla__prev');
	const nextButtonNode = rootNode.querySelector('.embla__next');
	prevButtonNode.addEventListener('click', embla.scrollPrev, false);
	nextButtonNode.addEventListener('click', embla.scrollNext, false);

	// Get the data
	const response = await client.getEntries({
		content_type: 'ppvNftSliderPost',
	});
	const items = response.items;
	// console.log(items);
	addSlides(embla, items, $component);
}

const addSlides = (embla, items) => {
	items.forEach((item) => {
		const f = item.fields;
		const $container = $(embla.containerNode());
		const html = $.parseHTML(cardTemplate);
		const $card = $(html);
		// Wrap in href if has CTA
		if (f.callToActionLink) {
			$card.find('.card').wrap(`<a href="${f.callToActionLink}"></a>`);
		}
		// Cover image
		$card.find('img')[0].src = f.coverImage.fields.file.url;
		// Title
		$card.find('.card-title').text(f.title);
		// Badge
		if (f.rarity) {
			$card.find('.badge.rarity').text(f.rarity).toggleClass('d-none d-block');
		}
		// Insert
		$container.append($card);
	});
	// Activate
	embla.reInit();
};

const cardTemplate = `
	<div class="embla__slide hover-1-reverse">
			<div class="card radius10 border-0 glass-1 pt-20">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<img src="../uploads/placeholder-1920x1080.jpg"
					class="card-img-top"
					alt="Pay-Per-View Cover Image">
				<div class="card-body color-main">
					<h6 class="card-title text-uppercase mb-5">
						...
					</h6>
					<span class="badge rarity badge-pill badge-danger d-none float-left mb-20 mt-10 mr-5">...</span>
				</div>
				<div class="card-footer text-left">
					<a href="#"
						class="btn glass-1 shadow mb-10 text-center mr-10 w-full comingSoon">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span class="nonEmpty">Buy</span>
					</a>
				</div>
			</div>
	</div>`;

const readMoreIndicatorTemplate = `
		<span class="badge badge-dark f-12 text-uppercase absolute zi-1" style="right:0; bottom:0;">Read more&nbsp;<i class="fas fa-external-link-square-alt"></i></span>
`;
