import { expect } from 'chai';
import { Promise } from 'bluebird';
import proxyquire from 'proxyquire';
import * as hrudbMock from '../db/hrudb-client.mock';


describe('HrudbRepeater', async () => {
    const hrudb = proxyquire('../db/hrudb-repeater', {
        './hrudb-client': {
            default: hrudbMock
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
        const [a, b, c] = ['SanaraBoi', '}{"SanaraBoi', 'SanaraBoi2'];
        await hrudb.post('key', a);
        await hrudb.post('key', b);
        await hrudb.post('key', c);
        const all = await hrudb.getAll('key');

        expect(all).to.be.deep.equal([a, b, c]);
    });
});

describe('HrudbRepeaterRace', async () => {
    const hrudb = proxyquire('../db/hrudb-repeater', {
        './hrudb-client': {
            default: hrudbMock
        }
    });
    const testKey = '__race';

    beforeEach(async () => {
        await hrudb.put(testKey, 'value1');
    });

    const raceTest = async () => {
        const value1 = await hrudb.get(testKey);
        await hrudb.put(testKey, 'value2');
        const value2 = await hrudb.get(testKey);

        expect(value1).to.be.equal('value1');
        expect(value2).to.be.equal('value2');
    };

    it('has no race dealing with same key', async () => {
        await Promise.mapSeries([...Array(3)], raceTest);
    });
});
