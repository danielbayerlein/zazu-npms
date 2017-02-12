const index = require('../src/');
const npms = require('../src/npms');

describe('index.js', () => {
  beforeEach(() => {
    npms.search = jest.fn();
    index()('zazu');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('called npms.search with zazu', () => {
    expect(npms.search).toBeCalledWith('zazu');
  });
});
