import { expect } from 'chai';
import { Promise } from 'bluebird';
import proxyquire from 'proxyquire';
import * as hrudbMock from '../db/hrudb-client.mock';


describe('HrudbRepeater', async () => {
    const hrudb = proxyquire('../db/hrudb-repeater', {
        './hrudb-client': hrudbMock
    });

    beforeEach(async () => {
        await hrudb.remove('key');
    });

    it('should put/get key-value', async () => {
        await hrudb.put('key', 'value');
        const value = await hrudb.get('key');

        expect(value).to.be.equal('value');
    });

    it('should post multiple values then getAll', async () => {
        const [a, b, c] = ['SanaraBoi', '}{"SanaraBoi', 'SanaraBoi2'];
        await hrudb.post('key', a);
        await hrudb.post('key', b);
        await hrudb.post('key', c);
        const all = await hrudb.getAll('key');

        expect(all).to.be.deep.equal([a, b, c]);
    });
});
