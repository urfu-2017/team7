/* eslint-disable no-console */
import proxyquire from 'proxyquire';
import { createWriteStream } from 'fs';
import moment from 'moment';
import Promise from 'bluebird';

const FILENAME = `./hrudb-stats-${moment().format('DD.MM.YY-HH.mm.ss')}.csv`;
const TEST_KEY = '__measurements';
const TEST_VALUE = 'VALUE';
const TIMES = 1000;

let hrudb;
let stream;

suite('HrudbStats');

const createWriteStreamAsync = fileName => new Promise((resolve) => {
    const result = createWriteStream(fileName);
    result.once('open', () => resolve(result));
});

after(async () => {
    console.info(`Check logs at ${FILENAME}`);
    stream.end();
});

before(async () => {
    stream = await createWriteStreamAsync(FILENAME);
    hrudb = proxyquire('../hrudb/hrudb-client', {
        '../config': {
            default: {
                HRUDB_TOKEN: '8f92d8b92cffc5d2c4ddb2af9959dfa9391b6f43',
                HRUDB_URL: 'https://hrudb.herokuapp.com'
            }
        }
    });
});

const range = [...Array(TIMES).keys()];
const testRequest = (requestType, getCodeAsync) => async () => {
    await Promise.mapSeries(range, async (i) => {
        const currentDate = new Date();
        const code = await getCodeAsync();
        const millis = new Date() - currentDate;
        stream.write([requestType, currentDate.toISOString(), millis, code].join(','));
        stream.write('\n');
        console.info(requestType, i + 1, 'out of', TIMES);
    });
};

const sends = requestType => `Sending ${TIMES} times ${requestType}`;

test(sends('DELETE'), testRequest('DELETE', () => hrudb.remove(TEST_KEY).then(() => 204, x => x.statusCode)));
test(sends('PUT'), testRequest('PUT', () => hrudb.put(TEST_KEY, TEST_VALUE).then(() => 201, x => x.statusCode)));
test(sends('POST'), testRequest('POST', () => hrudb.post(TEST_KEY, TEST_VALUE).then(() => 204, x => x.statusCode)));
test(sends('GET'), testRequest('GET', () => hrudb.get(TEST_KEY).then(() => 200, x => x.statusCode)));
