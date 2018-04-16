import { expect } from 'chai';
import { Promise } from 'bluebird';
import * as hrudb from '../db/hrudb-client.mock';
import { okResponses } from './helpers';


suite('HrudbClient');

/* Можно проверить тесты на оригинальной хрюше
const hrudb = proxyquire('../db/hrudb-client', {
    '../config': {
        default: {
            HRUDB_TOKEN: '8f92d8b92cffc5d2c4ddb2af9959dfa9391b6f43',
            HRUDB_URL: 'https://hrudb.herokuapp.com'
        }
    }
});
*/
beforeEach(async () => {
    hrudb.setResponses(okResponses(500));
    await hrudb.remove('key');
});

test('should put/get key-value', async () => {
    await hrudb.put('key', 'value');
    const value = await hrudb.get('key');

    expect(value).to.be.equal('value');
});

test('should post multiple values then getAll', async () => {
    const [a, b, c] = ['SanaraBoi', '}{"SanaraBoi', 'SanaraBoi2'];
    await Promise.mapSeries([a, b, c], value => hrudb.post('key', value));
    const all = await hrudb.getAll('key');

    expect(all).to.be.deep.equal([a, b, c]);
});

test.skip('should sort lexicographically and limit/offset', async () => {
    const [a, b, c] = ['a1', 'a2', 'b1'];
    await Promise.mapSeries([b, a, c], value => hrudb.post('key', value));
    const sorted = await hrudb.getAll('key', { sortByAlphabet: true });
    const lex = await hrudb.getAll('key', { sortByAlphabet: true, limit: 1, offset: 1 });
    const dated = await hrudb.getAll('key', { limit: 2, offset: 1 });

    expect(sorted).to.be.deep.equal([a, b, c]);
    expect(lex).to.be.deep.equal([b]);
    expect(dated).to.be.deep.equal([a, c]);
});

test('can\'t replace by put', async () => {
    const usersLikeValue = [{ a: 1 }];
    await hrudb.put('key', usersLikeValue);
    const totalValue = await hrudb.getAll('key');

    expect(totalValue).to.be.deep.equal([usersLikeValue]);
});

test('returns 204 on delete', async () => {
    await Promise.mapSeries([...Array(4)], () => hrudb.remove('key'));
});

test('returns empty array on getAll', async () => {
    const res = await hrudb.getAll('uniqueeeeKey');

    expect(res).to.be.lengthOf(0);
});
