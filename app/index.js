require('babel-core/register');
const getServer = require('./server').default;
const getConfig = require('./config').default;

if (require.main === module) {
    const config = getConfig();
    getServer(config).then((server) => {
        server.listen(config.PORT, config.HOST, (err) => {
            if (err) {
                throw err;
            }

            // eslint-disable-next-line no-console
            console.info(`> Running on http://${config.HOST}:${config.PORT}`);
        });
    });
}
