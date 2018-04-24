import { Promise } from 'bluebird';
import { expect, proxyquire, skipSuite } from '../helpers';


let sut;

suite('Hrudb.Client.Integration');

before(skipSuite);

beforeEach(async () => {
    sut = proxyquire('../db/hrudb/hrudb-client', {
        '../../config': {
            default: {
                HRUDB_TOKEN: '8f92d8b92cffc5d2c4ddb2af9959dfa9391b6f43',
                HRUDB_URL: 'https://hrudb.herokuapp.com'
            }
        }
    });
    await sut.remove('key');
});

test('should put/get key-value', async () => {
    await sut.put('key', 'value');
    const value = await sut.get('key');

    expect(value).to.be.equal('value');
});

test('should post multiple values then getAll', async () => {
    const [a, b, c] = ['SanaraBoi', '}{"SanaraBoi', 'SanaraBoi2'];
    await Promise.mapSeries([a, b, c], value => sut.post('key', value));
    const all = await sut.getAll('key');

    expect(all).to.be.deep.equal([a, b, c]);
});

test('should sort lexicographically and limit/offset', async () => {
    const [a, b, c] = ['a1', 'a2', 'b1'];
    await Promise.mapSeries([b, a, c], value => sut.post('key', value));
    const sorted = await sut.getAll('key', { sortByAlphabet: true });
    const lex = await sut.getAll('key', { sortByAlphabet: true, limit: 1, offset: 1 });
    const dated = await sut.getAll('key', { limit: 2, offset: 1 });

    expect(sorted).to.be.deep.equal([a, b, c]);
    expect(lex).to.be.deep.equal([b]);
    expect(dated).to.be.deep.equal([a, c]);
});

test('can\'t replace by put', async () => {
    const usersLikeValue = [{ a: 1 }];
    await sut.put('key', usersLikeValue);
    const totalValue = await sut.getAll('key');

    expect(totalValue).to.be.deep.equal([usersLikeValue]);
});

test('returns 204 on delete', async () => {
    await Promise.mapSeries([...Array(4)], () => sut.remove('key'));
});

test('returns empty array on getAll', async () => {
    const res = await sut.getAll('uniqueeeeKey');

    expect(res).to.be.lengthOf(0);
});
