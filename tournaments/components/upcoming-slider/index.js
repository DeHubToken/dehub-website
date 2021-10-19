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
