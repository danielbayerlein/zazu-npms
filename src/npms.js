const got = require('got');

const URL = 'https://api.npms.io/v2/search';
const RESULT_ITEMS = 10;

module.exports.search = query => (
  got(URL, { json: true, query: { q: query, size: RESULT_ITEMS } })
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
