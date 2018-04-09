import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { User, Chat } from '../db/datatypes';
import * as hrudbMock from '../db/hrudb-client.mock';


describe('Repositories', async () => {
    const hrudb = proxyquire('../db/hrudb-repeater', {
        './hrudb-client': hrudbMock
    });
    const userRepo = proxyquire('../db/users-repository', {
        './hrudb-client': hrudb
    });
    const chatsRepo = proxyquire('../db/chats-repository', {
        './hrudb-client': hrudb,
        './users-repository': userRepo
    });

    beforeEach(async () => {
        hrudbMock.clearDb();
    });

    it('can create chat for user', async () => {
        const user = new User(0, 'Admiral', null, [0]);
        const chat = new Chat(0, 'testchat', [0]);
        await userRepo.upsertUser(user);
        await chatsRepo.upsertChat(chat);
        const chats = await chatsRepo.getAllChatsForUser(user.userId);

        expect(chats).to.be.deep.equal([chat]);
    });
});
