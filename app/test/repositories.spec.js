import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { User, Chat } from '../db/datatypes';
import * as hrudbMock from '../db/hrudb-client.mock';


describe('Repositories', async () => {
    const hrudb = proxyquire('../db/hrudb-repeater', {
        './hrudb-client': hrudbMock
    });
    const userRepo = proxyquire('../db/users-repository', {
        './hrudb-repeater': hrudb
    });
    const chatsRepo = proxyquire('../db/chats-repository', {
        './hrudb-repeater': hrudb,
        './users-repository': userRepo
    });

    beforeEach(async () => {
        hrudbMock.clearDb();
        hrudbMock.setResponses([...Array(500).keys()].map(x => new hrudbMock.Response(x % 2 ? 200 : 418, x % 2 ? 'ok' : 'teapot')));
    });

    it('can create chat for user', async () => {
        const user = new User(0, 'Admiral', null, [0]);
        const chat = new Chat(0, 'testchat', [0]);
        await userRepo.upsertUser(user);
        await chatsRepo.upsertChat(chat);
        const chats = await chatsRepo.getAllChatsForUser(user.userId);

        expect(chats).to.be.deep.equal([chat]);
        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users: [[user]],
            Chats_0: [chat]
        });
    });

    it('can create user', async () => {
        const expected = new User(0, 'Admiral', null, [0]);
        await userRepo.upsertUser(expected);
        const user = await userRepo.getUser(expected.userId);

        expect(user).to.be.deep.equal(expected);
        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users: [[user]]
        });
    });

    it('can update user', async () => {
        await userRepo.upsertUser(new User(0, 'Admiral', null, [0]));
        const expected = new User(0, 'NewAdmiral', null, [0]);
        await userRepo.upsertUser(expected);
        const user = await userRepo.getUser(expected.userId);

        expect(user).to.be.deep.equal(expected);
        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users: [[user]]
        });
    });

    it('can join chat', async () => {
        const user = new User(0, 'Admiral', null, []);
        const chat = new Chat(0, 'testchat', []);
        await userRepo.upsertUser(user);
        await chatsRepo.upsertChat(chat);
        await chatsRepo.joinChat(user.userId, chat.chatId);
        const chats = await chatsRepo.getAllChatsForUser(user.userId);

        expect(chats).to.be.deep.equal([chat]);
        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users: [[user]],
            Chats_0: [chat]
        });
    });
});
