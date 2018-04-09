import { expect } from 'chai';
import { Promise } from 'bluebird';
import proxyquire from 'proxyquire';
import * as hrudbMock from '../db/hrudb-client.mock';


describe('HrudbRepeater', async () => {
    const hrudb = proxyquire('../db/hrudb-repeater', {
        './hrudb-client': hrudbMock
    });

    beforeEach(async () => {
        hrudbMock.clearDb();
        hrudbMock.setResponses([...Array(500).keys()].map(x => new hrudbMock.Response(x % 2 ? 200 : 418, x % 2 ? 'ok' : 'teapot')));
    });

    it('should put/get key-value', async () => {
        await hrudb.put('key', 'value');
        const value = await hrudb.get('key');

        expect(value).to.be.equal('value');
    });

    it('should post multiple values then getAll', async () => {
        const expected = ['SanaraBoi', '}{"SanaraBoi', 'SanaraBoi2'];
        await Promise.mapSeries(expected, value => hrudb.post('key', value));
        const all = await hrudb.getAll('key');

        expect(all).to.be.deep.equal(expected);
    });

    it('returns 404 http code immediately', async () => {
        const { statusCode } = await hrudb.get('key').catch(x => x);

        expect(statusCode).to.be.equal(404);
    });
});
