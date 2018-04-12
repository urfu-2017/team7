import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { rotateResponses } from '../utils/test';
import * as hrudbMock from '../db/hrudb-client.mock';
import { User } from '../db/datatypes';


describe('LoginManager.loginUser', async () => {
    const hrudb = proxyquire('../db/hrudb-repeater', {
        './hrudb-client': hrudbMock
    });
    const userRepo = proxyquire('../db/users-repository', {
        './hrudb-repeater': hrudb
    });
    const loginUser = proxyquire('../db/login-manager', {
        './users-repository': userRepo
    }).default;

    beforeEach(async () => {
        hrudbMock.clearDb();
        hrudbMock.setResponses(rotateResponses(500));
    });

    it('saves new user', async () => {
        await loginUser(0, 'name1');

        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users_0: [new User(0, 'name1', '/avatar/0', [])],
            AllUsers: [{ 0: 'name1' }]
        });
    });

    it('won\'t overwrite fields', async () => {
        hrudbMock.setDb({
            Users_0: [new User(0, 'name1', 'custom_avatar', ['chatik'])],
            AllUsers: [{ 0: 'name1' }]
        });
        await loginUser(0, 'name1');

        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users_0: [new User(0, 'name1', 'custom_avatar', ['chatik'])],
            AllUsers: [{ 0: 'name1' }]
        });
    });
});
