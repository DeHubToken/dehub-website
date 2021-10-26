import { constants } from '../../../custom/js/constants.js';

// Fetch template and update the DOM
fetch('/tournaments/components/tournament-slider/template.html')
	.then((response) => response.text())
	.then((data) => initTournamentSlider(data));

async function initTournamentSlider(data) {
	const client = contentful.createClient({
		// This is the space ID. A space is like a project folder in Contentful terms
		space: '4jicnfvodfm8',
		// This is the access token for this space. Normally you get both ID and the token in the Contentful web app
		accessToken: constants.CONTENTFUL_KEY,
	});
	// Update DOM
	const $component = $('tournament-slider');
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
		content_type: 'tournament',
		'fields.featured': false,
		order: '-fields.date',
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
		// Date
		const d = new Date(f.date);
		$card.find('.date').text(d.toUTCString().replace('GMT', 'UTC'));
		// Badge
		const now = new Date();
		if (d < now) {
			$card.find('.badge.fin').toggleClass('d-none d-block');
		} else {
			$card.find('.badge.upcoming').toggleClass('d-none d-block');
		}
		// Insert
		$container.append($card);
	});
	// Activate
	setTimeout(function () {
		embla.reInit();
	}, 1000);
};

const cardTemplate = `
	<div class="embla__slide">
		<div class="card bg-transparent bg-gradient-2 radius10 border-0">
			<img src="../uploads/placeholder-1920x1080.jpg"
				class="card-img-top"
				alt="Tournament Cover Image">
			<div class="card-body">
				<h6 class="card-title text-uppercase mb-5">
					...
				</h6>
				<span class="date-container d-block float-left w-full mb-5">
					<i class="fal fa-calendar-alt f-20 pr-5 pt-5"></i>&nbsp;<span class="date text-monospace small f-12 bold">...</span>
				</span>
				<span class="badge badge-pill badge-warning d-none float-left mb-20 mt-10 mr-5"></span>
				<span class="badge upcoming badge-pill badge-danger d-none float-left mb-20 mt-10 mr-5">Upcoming</span>
				<span class="badge fin badge-pill badge-secondary d-none float-left mb-20 mt-10 mr-5">Finished</span>
			</div>
		</div>
	</div>`;
