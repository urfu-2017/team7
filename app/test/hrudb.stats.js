import proxyquire from 'proxyquire';
import { createWriteStream } from 'fs';


const createWriteStreamAsync = fileName => new Promise((resolve) => {
    const stream = createWriteStream(fileName);
    stream.once('open', () => resolve(stream));
});

describe('HrudbStats', async () => {
    const fileName = `./hrudb-stats-${String(new Date()).replace(/[^\d]/g, '')}.csv`;
    const testKey = '__measurements';
    const testValue = 'VALUE';
    const times = 10;
    const hrudb = proxyquire('../db/hrudb-client', {
        '../config': {
            default: {
                HRUDB_TOKEN: '8f92d8b92cffc5d2c4ddb2af9959dfa9391b6f43',
                HRUDB_URL: 'https://hrudb.herokuapp.com'
            }
        }
    });

    let stream = null;
    const sends = requestType => `Sending ${times} times ${requestType}`;
    const range = [...Array(times)];
    const test = (requestType, getCodeAsync) => async () => {
        const promises = range.map(async () => {
            const currentDate = new Date();
            const code = await getCodeAsync();
            const millis = new Date() - currentDate;
            stream.write([requestType, currentDate.toISOString(), millis, code].join(','));
            stream.write('\n');
            // console.info(requestType, currentDate, millis, code);
        });

        await Promise.all(promises);
    };

    it(sends('DELETE'), test('DELETE', () => hrudb.remove(testKey).then(() => 204, x => x.statusCode)));
    it(sends('PUT'), test('PUT', () => hrudb.put(testKey, testValue).then(() => 201, x => x.statusCode)));
    it(sends('POST'), test('POST', () => hrudb.post(testKey, testValue).then(() => 204, x => x.statusCode)));
    it(sends('GET'), test('GET', () => hrudb.get(testKey).then(() => 200, x => x.statusCode)));

    after(async () => {
        console.info(`Check logs at ${fileName}`);
        stream.end();
    });
    before(async () => {
        stream = await createWriteStreamAsync(fileName);
    });
});
