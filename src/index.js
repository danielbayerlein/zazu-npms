const npms = require('./npms');

module.exports = () => (
  name => npms.search(name)
);
