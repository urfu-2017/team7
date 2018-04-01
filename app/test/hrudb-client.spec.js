'use strict';

import { HrudbClient } from '../db/hrudb-client';
import { expect } from 'chai';

describe('HrudbClient', async () => {
    const testToken = '8f92d8b92cffc5d2c4ddb2af9959dfa9391b6f43';
    const hrudb = new HrudbClient(testToken);

    it('should put/get key-value', async () => {
        await hrudb.put('key', 'value');
        const value = await hrudb.get('key');

        expect(value).to.be.equal('value');
    })
})