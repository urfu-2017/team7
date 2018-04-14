require('babel-core/register');
const run = require('./server').default;
const runDbShell = require('./db-shell').default;

if (require.main === module) {
    if (process.argv[2] === 'db-shell') {
        runDbShell();
    } else {
        run();
    }
}
