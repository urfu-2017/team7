require('babel-core/register');
const run = require('./server').default;

if (require.main === module) {
    run();
}
