import bunyan from 'bunyan';
import Bunyan2Loggly from 'bunyan-loggly';
import bunyanFormat from 'bunyan-format';
import BunyanTelegramStream from 'bunyan-telegram-stream';
import config from '../config';


const bufferLength = 10;
const bufferTimeout = 500;
const requestSerializer = (req) => {
    const parsed = bunyan.stdSerializers.req(req);
    const user = req.user || {};
    return `[${parsed.method} ${parsed.url}] [User: ${user.userId || 'Not logged'}] [${parsed.headers['user-agent']}]`;
};

const consoleStream = {
    level: 'trace',
    stream: bunyanFormat({ outputMode: 'long' })
};

const getTelegramStreams = () => config.TELEGRAM_CHAT_IDS.map(chatId =>
    ({
        type: 'raw',
        level: 'error',
        stream: new BunyanTelegramStream(config.TELEGRAM_BOT_TOKEN, chatId)
    }));

const getLogglyStream = name => [{
    type: 'raw',
    stream: new Bunyan2Loggly({
        token: config.LOGGLY_TOKEN,
        subdomain: config.LOGGLY_SUBDOMAIN,
        tags: ['nodejs-server', `env-${config.IS_PRODUCTION ? 'production' : 'test'}`, name]
    }, bufferLength, bufferTimeout)
}];

export default (name) => {
    const streams = [].concat(
        [consoleStream],
        config.TELEGRAM_BOT_TOKEN ? getTelegramStreams() : [],
        config.LOGGLY_SUBDOMAIN ? getLogglyStream(name) : []
    );

    return bunyan.createLogger({
        name,
        streams,
        serializers: {
            err: bunyan.stdSerializers.err,
            res: bunyan.stdSerializers.res,
            req: requestSerializer
        }
    });
};
