const npms = require('../src/npms');

describe('npmjs.js', () => {
  describe('search', () => {
    const searchResult = npms.search('zazu');

    test('returns an array', () => (
      searchResult.then((packages) => {
        expect(packages).toBeInstanceOf(Array);
      })
    ));

    test('returns an object with a title', () => (
      searchResult.then((packages) => {
        expect(packages[0].title).toBeDefined();
      })
    ));

    test('returns an object with a value', () => (
      searchResult.then((packages) => {
        expect(packages[0].value).toBeDefined();
      })
    ));

    test('returns an object with a subtitle', () => (
      searchResult.then((packages) => {
        expect(packages[0].subtitle).toBeDefined();
      })
    ));
  });
});
