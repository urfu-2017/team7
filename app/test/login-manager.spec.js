import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { rotateResponses } from './helpers';
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
        const users = await userRepo.getAllUsers();
        const user = await userRepo.getUser(0);

        expect(users).to.be.deep.equal({ 0: 'name1' });
        expect(user).to.be.deep.equal(new User(0, 'name1', '/avatar/0', []));
    });

    it('won\'t overwrite fields', async () => {
        const expected = new User(0, 'name1', 'custom_avatar', ['chatik']);
        await loginUser(0, 'name1');
        await userRepo.upsertUser(expected);
        await loginUser(0, 'name1');
        const users = await userRepo.getAllUsers();
        const user = await userRepo.getUser(0);

        expect(users).to.be.deep.equal({ 0: 'name1' });
        expect(user).to.be.deep.equal(expected);
    });
});
