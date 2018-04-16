import { expect } from 'chai';
import { Promise } from 'bluebird';
import proxyquire from 'proxyquire';
import { rotateResponses } from './helpers';
import * as hrudbMock from '../db/hrudb-client.mock';

let hrudb;
suite('HrudbRepeater');

beforeEach(async () => {
    hrudb = proxyquire('../db/hrudb-repeater', {
        './hrudb-client': hrudbMock
    });
    hrudbMock.clearDb();
    hrudbMock.setResponses(rotateResponses(500));
});

test('should put/get key-value', async () => {
    await hrudb.put('key', 'value');
    const value = await hrudb.get('key');

    expect(value).to.be.equal('value');
});

test('should post multiple values then getAll', async () => {
    const expected = ['SanaraBoi', '}{"SanaraBoi', 'SanaraBoi2'];
    await Promise.mapSeries(expected, value => hrudb.post('key', value));
    const all = await hrudb.getAll('key');

    expect(all).to.be.deep.equal(expected);
});

test('returns 404 http code immediately', async () => {
    const { statusCode } = await hrudb.get('key').catch(x => x);

    expect(statusCode).to.be.equal(404);
});
