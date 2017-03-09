describe('npmjs.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('search', () => {
    let got;
    let npms;

    beforeEach(() => {
      jest.mock('got');
      got = require('got'); // eslint-disable-line global-require
      npms = require('../src/npms'); // eslint-disable-line global-require
      console.error = jest.fn(); // eslint-disable-line no-console

      got.mockImplementation(() => new Promise(resolve => resolve({
        // eslint-disable-next-line global-require
        body: require('../__mocks__/result.json'),
      })));
    });

    test('call got with url and options', () => (
      npms.search('git-pick')
        .then(() => {
          expect(got).toHaveBeenCalledWith(
            'https://api.npms.io/v2/search',
            {
              json: true,
              query: {
                q: 'git-pick',
                size: 10,
              },
            },
          );
        })
    ));

    test('returns an array', () => (
      npms.search('git-pick')
        .then((packages) => {
          expect(packages).toBeInstanceOf(Array);
        })
      ));

    test('returns the expected title', () => (
      npms.search('git-pick')
        .then((packages) => {
          expect(packages[0].title).toBe('@danielbayerlein/git-pick');
        })
      ));

    test('returns the expected value', () => (
      npms.search('git-pick')
        .then((packages) => {
          expect(packages[0].value).toBe(
            'https://www.npmjs.com/package/%40danielbayerlein%2Fgit-pick',
          );
        })
      ));

    test('returns the expected subtitle', () => (
      npms.search('git-pick')
        .then((packages) => {
          expect(packages[0].subtitle).toBe('git cherry-pick to multiple branches');
        })
    ));

    test('call console.error with an error message', () => {
      got.mockImplementation(() => new Promise((resolve, reject) => reject({
        response: {
          body: '{"code":"INVALID_PARAMETER","message":"child "text" fails ' +
                'because ["text" is not allowed to be empty]"}',
        },
      })));

      return npms.search('git-pick')
        .then(() => {
          // eslint-disable-next-line no-console
          expect(console.error).toHaveBeenCalledWith(
            '{"code":"INVALID_PARAMETER","message":"child "text" fails ' +
            'because ["text" is not allowed to be empty]"}',
          );
        });
    });
  });

  describe('integration', () => {
    // eslint-disable-next-line global-require
    const npms = require('../src/npms');
    const searchResult = npms.search('git-pick');

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
