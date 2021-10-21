import { constants } from '../../../custom/js/constants.js';

// Fetch template and update the DOM
fetch('/ppv/components/ppv-slider/template.html')
	.then((response) => response.text())
	.then((data) => initPPVSlider(data));

async function initPPVSlider(data) {
	const client = contentful.createClient({
		// This is the space ID. A space is like a project folder in Contentful terms
		space: '4jicnfvodfm8',
		// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
		accessToken: constants.CONTENTFUL_KEY,
	});
	// Update DOM
	const $component = $('ppv-slider');
	$component.html(data);

	// Prepare Carousel
	const rootNode = document.querySelector('.embla');
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
		content_type: 'ppvSliderPost',
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
		// Cover image
		$card.find('img')[0].src = f.coverImage.fields.file.url;
		// Title
		$card.find('.card-title').text(f.title);
		// Description
		const $converted = $(documentToHtmlString(f.description));
		$card.find('.description').html($converted);
		// Insert
		$container.append($card);
	});
	// Activate
	embla.reInit();
};

const cardTemplate = `
	<div class="embla__slide hvr-shrink">
		<a href="#">
			<div class="card bg-transparent bg-gradient-2 radius10 border-0">
				<img src="../uploads/placeholder-1920x1080.jpg"
					class="card-img-top"
					alt="Pay-Per-View Cover Image">
				<div class="card-body color-main">
					<h6 class="card-title text-uppercase mb-5">
						...
					</h6>
					<div class="card-text description d-block float-left small"></div>
				</div>
			</div>
		</a>
	</div>`;
