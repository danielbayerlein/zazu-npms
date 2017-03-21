/* eslint global-require: 0 */

describe('npmjs.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('search', () => {
    let got;
    let npms;
    let cache;

    const mockResult = require('../__mocks__/result.json').results.map(result => ({
      id: result.package.name,
      title: result.package.name,
      value: result.package.links.npm,
      subtitle: result.package.description,
    }));

    beforeEach(() => {
      jest.mock('got');
      got = require('got');

      jest.mock('cache-conf');
      cache = { get: jest.fn(), isExpired: jest.fn(), set: jest.fn() };
      require('cache-conf').mockImplementation(() => cache);

      npms = require('../src/npms');

      got.mockImplementation(() => new Promise(resolve => resolve({
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

    test('returns the expected id', () => (
      npms.search('git-pick')
        .then((packages) => {
          expect(packages[0].id).toBe('@danielbayerlein/git-pick');
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

    test('returns the expected error', () => {
      const body = '{"code":"INVALID_PARAMETER","message":"child "text" fails because ["text" is not allowed to be empty]"}';

      got.mockImplementation(() => new Promise((resolve, reject) => reject({
        response: { body },
      })));

      return npms.search('git-pick')
        .catch((packages) => {
          expect(packages.response.body).toBe(body);
        });
    });

    test('call cache.get with the expected arguments', () => (
      npms.search('git-pick')
        .then(() => {
          expect(cache.get).toBeCalledWith(
            'zazu-npms.git-pick',
            { ignoreMaxAge: true },
          );
        })
    ));

    test('call cache.set with the expected arguments', () => (
      npms.search('git-pick')
        .then(() => {
          expect(cache.set).toBeCalledWith(
            'zazu-npms.git-pick',
            mockResult,
            { maxAge: 3600000 },
          );
        })
    ));

    test('call cache.isExpired with the expected argument', () => {
      cache.get = jest.fn(() => mockResult);

      return npms.search('git-pick')
        .then(() => {
          expect(cache.isExpired).toBeCalledWith('zazu-npms.git-pick');
        });
    });

    test('returns the cache result', () => {
      cache.isExpired = jest.fn(() => false);
      cache.get = jest.fn(() => mockResult);

      return npms.search('git-pick')
        .then((packages) => {
          expect(packages).toEqual(mockResult);
        });
    });

    test('returns the cache result when an error occurs', () => {
      cache.isExpired = jest.fn(() => true);
      cache.get = jest.fn(() => mockResult);
      got.mockImplementation(() => new Promise((resolve, reject) => reject()));

      return npms.search('git-pick')
        .then((packages) => {
          expect(packages).toEqual(mockResult);
        });
    });
  });

  describe('integration', () => {
    jest.mock('cache-conf');

    const npms = require('../src/npms');
    const searchResult = npms.search('git-pick');

    test('returns an array', () => (
      searchResult.then((packages) => {
        expect(packages).toBeInstanceOf(Array);
      })
    ));

    test('returns an object with a id', () => (
      searchResult.then((packages) => {
        expect(packages[0].id).toBeDefined();
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
