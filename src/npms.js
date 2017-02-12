const got = require('got');

const API_VERSION = 2;
const RESULT_ITEMS = 10;
const GOT_OPTIONS = { json: true };

const searchUrl = query => (
  `https://api.npms.io/v${API_VERSION}/search?q=${query}&size=${RESULT_ITEMS}`
);

module.exports.search = query => (
  got(searchUrl(query), GOT_OPTIONS)
    .then(response => (
      response.body.results.map(result => (
        {
          title: result.package.name,
          value: result.package.links.npm,
          subtitle: result.package.description,
        }
      ))
    ))
    .catch((error) => {
      console.error(error.response.body); // eslint-disable-line no-console
    })
);
