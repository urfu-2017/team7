import bunyan from 'bunyan';
import Bunyan2Loggly from 'bunyan-loggly';
import bunyanFormat from 'bunyan-format';
import { sendMessageFor } from 'simple-telegram-message';
import config from '../config';


const bufferLength = 10;
const bufferTimeout = 500;
const requestSerializer = (request) => {
    const { method, url, headers } = bunyan.stdSerializers.req(request);

    const result = {
        method,
        url,
        userAgent: headers['user-agent'],
        ip: request.ip
    };
    if (request.user) {
        result.userId = request.user.userId;
    }
    return result;
};

const consoleStream = {
    level: config.CONSOLE_LOG_LEVEL,
    stream: bunyanFormat({ outputMode: 'long' })
};

const getLevelName = level => ({
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal'
}[level]);

const formatRequest = (lines, request) => {
    const {
        method, url, userId, ip
    } = request;
    lines.push(`<pre>${method} ${url}`);
    if (userId) {
        lines.push(`    github: https://api.github.com/user/${userId}`);
        lines.push(`    userId: ${userId}`);
    }
    lines.push(`    ip: ${ip}`);
    lines.push('</pre>');
};

const getTelegramStream = (chatId) => {
    const tg = sendMessageFor(config.TELEGRAM_BOT_TOKEN, chatId);
    const stream = {
        write(obj) {
            const {
                name, pid, level, err, request, msg
            } = obj;
            const lines = [`[<b>${getLevelName(level)}</b>] <i>on ${name}/${pid}:</i>`];
            if ((err || {}).message !== msg) {
                lines.push(`<pre>${msg}</pre>`);
            }
            if (err) {
                lines.push(`<code>${err.name}</code> was thrown: <code>${err.message}</code>`);
            }
            if (request) {
                formatRequest(lines, request);
            }
            tg(lines.join('\n')).catch((x) => {
                // eslint-disable-next-line no-console
                console.error(`Failed to send telegram log (chatId=${chatId}) (code=${x.statusCode})`);
            });
        }
    };

    return {
        type: 'raw',
        level: 'info',
        stream
    };
};

const getTelegramStreams = () => config.TELEGRAM_CHAT_IDS.map(getTelegramStream);

const getLogglyStream = name => ({
    type: 'raw',
    level: 'info',
    stream: new Bunyan2Loggly({
        token: config.LOGGLY_TOKEN,
        subdomain: config.LOGGLY_SUBDOMAIN,
        tags: ['nodejs-server', `env-${config.IS_PRODUCTION ? 'production' : 'test'}`, name]
    }, bufferLength, bufferTimeout)
});

export default (name) => {
    const streams = [consoleStream];
    if (config.TELEGRAM_BOT_TOKEN) {
        streams.push(...getTelegramStreams());
    }
    if (config.LOGGLY_SUBDOMAIN) {
        streams.push(getLogglyStream(name));
    }

    return bunyan.createLogger({
        name,
        streams,
        serializers: {
            err: bunyan.stdSerializers.err,
            res: bunyan.stdSerializers.res,
            request: requestSerializer
        }
    });
};
