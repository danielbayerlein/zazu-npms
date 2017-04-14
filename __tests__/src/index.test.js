const index = require('../../src/')
const npms = require('../../src/npms')

describe('index.js', () => {
  beforeEach(() => {
    npms.search = jest.fn()
    index()('git-pick')
  })

  afterEach(() => jest.resetAllMocks())

  test('call npms.search with "git-pick"', () => {
    expect(npms.search).toBeCalledWith('git-pick')
  })
})
