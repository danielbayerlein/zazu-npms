const got = require('got')
const CacheConf = require('cache-conf')

const URL = 'https://api.npms.io/v2/search'
const RESULT_ITEMS = 10

const CACHE_CONF = {
  key: 'zazu-npms', // cache key prefix
  maxAge: 3600000 // 1 hour
}

const cache = new CacheConf()

/**
 * Fetch the URL, cache the result and return it.
 * Returns the cache result if it is valid.
 *
 * @param  {string}  query Search query
 * @return {Promise}       Returns a promise that is fulfilled with the JSON result
 */
module.exports.search = (query) => {
  const cacheKey = `${CACHE_CONF.key}.${query}`
  const cachedResponse = cache.get(cacheKey, { ignoreMaxAge: true })

  if (cachedResponse && !cache.isExpired(cacheKey)) {
    return Promise.resolve(cachedResponse)
  }

  return new Promise((resolve, reject) => (
    got(URL, { json: true, query: { q: query, size: RESULT_ITEMS }, useElectronNet: false })
      .then((response) => {
        const data = response.body.results.map((result) => ({
          id: result.package.name,
          title: result.package.name,
          value: result.package.links.npm,
          subtitle: result.package.description
        }))

        cache.set(cacheKey, data, { maxAge: CACHE_CONF.maxAge })

        resolve(data)
      })
      .catch((err) => {
        if (cachedResponse) {
          resolve(cachedResponse)
        }

        reject(err)
      })
  ))
}
