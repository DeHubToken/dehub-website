import { constants } from '../constants.js';

$(async () => {
  const $body = $('body');
  const contentType = $body.data('content-type');

  if (contentType) {
    const client = contentful.createClient({
      // This is the space ID. A space is like a project folder in Contentful terms
      space: '4jicnfvodfm8',
      // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
      accessToken: constants.CONTENTFUL_KEY,
    });

    const response = await client.getEntries({
      content_type: contentType,
    });
    const items = response.items;
    // console.log(items);
    if (items.length > 0) {
      const image = items[0].fields.backgroundImage.fields.file.url;
      $('body').css(
        'background',
        'linear-gradient(45deg, rgba(11, 17, 19, 0.9), rgba(5, 17, 24, 0.9) 46%, rgba(6, 12, 29, 1) 71%, rgba(50, 19, 56, 1)), url("' +
          image +
          '") no-repeat fixed center center /cover'
      );
    }
  }
});
