import { constants } from '../../../custom/js/constants.js';

// Fetch template and update the DOM
fetch('/ppv/components/ppv-video/template.html')
	.then((response) => response.text())
	.then((data) => initPPVVideo(data));

function initPPVVideo(data) {
	// Update DOM
	const $component = $('ppv-video');
	$component.html(data);

	$('.unmute').on('click', (e) => {
		const iframe = document.querySelector('iframe');
		const vimeo_player = new Vimeo.Player(iframe);
		vimeo_player.setMuted(false);
		vimeo_player.setVolume(1);
		$(e.target).closest('.unmute').fadeOut();
	});
}

// FIXME: i know i know....
// $('document').on('ready', function () {
setTimeout(function () {
	// If you want to control the embeds, you’ll need to create a Player object.
	// You can pass either the `<div>` or the `<iframe>` created inside the div.
	/* get video element */
	const iframe = document.getElementById('vimeo-video');
	const vimeo_player = new Vimeo.Player(iframe);
	vimeo_player.on('play', function () {
		/* For debugging - remove this line from your code";*/
		document.getElementById('videostatus').innerHTML = 'play video!';
	});
	vimeo_player.on('pause', function () {
		/* For debugging - remove this line from your code";*/
		document.getElementById('videostatus').innerHTML = 'pause video!';
	});
	//When the player is ready, set the volume to 0
	vimeo_player.ready().then(function () {
		vimeo_player.setVolume(0);
	});
	/* #########################################
			 WayPoints JS
			 https://github.com/imakewebthings/
			############################################ */
	const inview = new Waypoint.Inview({
		element: $('#video'),
		/* The enter callback is triggered when any piece of the element starts entering the viewport */
		enter: function (direction) {
			vimeo_player.play();
		},
		/* The entered callback is triggered when the entirety of the element has finished entering the viewport. */
		entered: function (direction) {
			vimeo_player.play();
		},
	});
}, 3000);
// });
