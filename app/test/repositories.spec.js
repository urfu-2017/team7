import { expect } from 'chai';
import { Promise } from 'bluebird';
import proxyquire from 'proxyquire';
import { User, Chat, Message } from '../db/datatypes';
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

    it('can create chat for user', async () => {
        const user = new User(0, 'Admiral', null, [0]);
        const chat = new Chat(0, 'testchat', [0]);
        await userRepo.saveUser(user);
        await chatsRepo.createChat(chat);
        const chats = await chatsRepo.getAllChatsForUser(user.id);

        expect(chats).to.be.deep.equal([chat]);
    });

    it('has no race while creating multiple users', async () => {
        const [a, b, c] = [
            new User(0, 'user1', '', []),
            new User(0, 'user2', '', []),
            new User(0, 'user3', '', [])
        ];
        await Promise.mapSeries([a, b, c], user => userRepo.createIfNotExists(user.name, user.id));
        const users = await userRepo.getAllUsers();

        expect(users).to.be.deep.equal([a, b, c]);
    });
});
