require('babel-core/register');
const run = require('./server').default;


if (require.main === module) {
    if (process.argv[2] === 'db-shell') {
        const runDbShell = require('./db-shell').default; // eslint-disable-line global-require
        runDbShell();
    } else {
        run();
    }
}
