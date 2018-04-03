require('babel-core/register');
const getServer = require('./server').default;
const getConfig = require('./config').default;

if (require.main === module) {
    const config = getConfig();
    const server = getServer(config);

    server.listen(config.PORT, config.HOST, (err) => {
        if (err) {
            throw err;
        }

        console.info(`> Running on http://${config.HOST}:${config.PORT}`);
    });
}
