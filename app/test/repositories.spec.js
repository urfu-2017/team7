import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { User, Chat } from '../db/datatypes';
import { rotateResponses, okResponses, badResponses } from '../utils/test';
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
        hrudbMock.setResponses(rotateResponses(500));
    });

    it('can create chat for user', async () => {
        const user = new User(0, 'Admiral', null, [0]);
        const chat = new Chat(0, 'testchat', [0]);
        await userRepo.upsertUser(user);
        await chatsRepo.upsertChat(chat);
        const chats = await chatsRepo.getAllChatsForUser(user.userId);

        expect(chats).to.be.deep.equal([chat]);
        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users_0: [user],
            Chats_0: [chat]
        });
    });

    it('can create user', async () => {
        const expected = new User(0, 'Admiral', null, [0]);
        await userRepo.upsertUser(expected);
        const user = await userRepo.getUser(expected.userId);

        expect(user).to.be.deep.equal(expected);
        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users_0: [user]
        });
    });

    it('can update user', async () => {
        await userRepo.upsertUser(new User(0, 'Admiral', null, [0]));
        const expected = new User(0, 'NewAdmiral', null, [0]);
        await userRepo.upsertUser(expected);
        const user = await userRepo.getUser(expected.userId);

        expect(user).to.be.deep.equal(expected);
        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users_0: [user]
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
            Users_0: [user],
            Chats_0: [chat]
        });
    });

    it('can create user (upsertUserWithIndex)', async () => {
        const expected = new User(0, 'Admiral', null, [0]);
        await userRepo.upsertUserWithIndex(expected);
        const user = await userRepo.getUser(expected.userId);

        expect(user).to.be.deep.equal(expected);
        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users_0: [user],
            AllUsers: [{ [user.userId]: user.username }]
        });
    });

    it('can update user (upsertUserWithIndex)', async () => {
        await userRepo.upsertUser(new User(0, 'Admiral', null, [0]));
        const expected = new User(0, 'NewAdmiral', null, [0]);
        await userRepo.upsertUserWithIndex(expected);
        const user = await userRepo.getUser(expected.userId);

        expect(user).to.be.deep.equal(expected);
        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users_0: [user],
            AllUsers: [{ [user.userId]: user.username }]
        });
    });

    it('won\'t rewrite index while upsertUserWithIndex', async () => {
        const [a, b] = [
            new User(0, 'Admiral', null, [0]),
            new User(1, 'Misha', null, [0])
        ];
        await userRepo.upsertUserWithIndex(a);
        hrudbMock.setResponses([].concat(okResponses(500), badResponses(10)));
        await userRepo.upsertUserWithIndex(b).catch(x => x);

        expect(hrudbMock.getDb()).to.be.deep.equal({
            Users_0: [a],
            AllUsers: [{
                [a.userId]: a.username
            }]
        });
    });
});
