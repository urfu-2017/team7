import { expect } from 'chai';
import proxyquire from 'proxyquire';


describe.skip('HrudbClient', async () => {
    const testToken = '8f92d8b92cffc5d2c4ddb2af9959dfa9391b6f43';
    const hrudb = proxyquire('../db/hrudb-client', {
        '../config': {
            default: {
                HRUDB_TOKEN: testToken,
                HRUDB_URL: 'https://hrudb.herokuapp.com'
            }
        }
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
        const expected = ['SanaraBoi', '}{"SanaraBoi', 'SanaraBoi2'];
        await Promise.all(expected.map(x => hrudb.post('key', x)));
        const all = await hrudb.getAll('key');

        expect(all).to.be.deep.equal(expected);
    });
});