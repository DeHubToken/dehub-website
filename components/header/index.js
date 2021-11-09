// Fetch template and update the DOM
fetch('/components/header/template.html')
  .then(response => response.text())
  .then(data => initHeader(data));

function initHeader(data) {
  // Update DOM
  const $component = $('header');
  $component.html(data);
  $component.addClass('pt-160 pb-60 header_5');
  const options = $component.data('options');
  if (options) {
    if (options.size === 'small') {
      $component.find('.header-small-title').show();
      $component.find('.header-big-title').remove();
    } else if (options.size === 'big') {
      $component.find('.header-big-title').show();
      $component.find('.header-small-title').remove();
      heroTitleAnimate();
    } else {
      $component.find('.header-big-title').remove();
      $component.find('.header-small-title').remove();
    }
    if (options.pageIndicator) {
      $component.find('.main-logo').addClass('pb-10');
      $component.find('.page-indicator span').html(options.pageIndicator);
    }
  }

  // Fix bootstrap dropdown overlow issue inside header
  const $navDropdown = $('#nav-dropdown');
  $(window).on('scroll', () => {
    $navDropdown.dropdown('hide');
  });
}

function heroTitleAnimate() {
  const target = document.getElementById('animate-title');

  const typewriter = new Typewriter(target, {
    loop: true,
    delay: 20,
    deleteSpeed: 10,
  });

  typewriter
    .typeString('Entertainment')
    .pauseFor(2000)
    .deleteAll()
    .typeString('Streaming')
    .pauseFor(2000)
    .deleteAll()
    .typeString('Gaming')
    .pauseFor(2000)
    .deleteAll()
    .typeString('Metaverse')
    .pauseFor(2000)
    .deleteAll()
    .typeString('Lifestyle')
    .pauseFor(2000)
    .deleteAll()
    .typeString('Experiences')
    .pauseFor(2000)
    .deleteAll()
    .typeString('Events')
    .pauseFor(2000)
    .deleteAll()
    .typeString('Shopping')
    .pauseFor(2000)
    .deleteAll()
    .start();
}
