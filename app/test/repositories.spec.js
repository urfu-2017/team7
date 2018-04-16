import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { User, Chat } from '../hrudb/datatypes';
import { rotateResponses } from './helpers';
import * as hrudbMock from '../hrudb/hrudb-client.mock';

suite('Repositories');

let hrudb, userRepo, chatsRepo;

beforeEach(async () => {
    hrudb = proxyquire('../hrudb/hrudb-repeater', {
        './hrudb-client': hrudbMock
    });
    userRepo = proxyquire('../hrudb/users-repository', {
        './hrudb-repeater': hrudb
    });
    chatsRepo = proxyquire('../hrudb/chats-repository', {
        './hrudb-repeater': hrudb,
        './users-repository': userRepo
    });
    hrudbMock.clearDb();
    hrudbMock.setResponses(rotateResponses(500));
});

test('can create chat for user', async () => {
    const user = new User(0, 'Admiral', null, [0]);
    const chat = new Chat(0, 'testchat', [0]);
    await userRepo.upsertUser(user);
    await chatsRepo.upsertChat(chat);
    const actualChat = await chatsRepo.getChat(0);

    expect(actualChat).to.be.deep.equal(chat);
    expect(hrudbMock.getDb()).to.be.deep.equal({
        Users_0: [user],
        Chats_0: [chat]
    });
});

test('can create user', async () => {
    const expected = new User(0, 'Admiral', null, [0]);
    await userRepo.upsertUser(expected);
    const user = await userRepo.getUser(expected.userId);

    expect(user).to.be.deep.equal(expected);
    expect(hrudbMock.getDb()).to.be.deep.equal({
        Users_0: [user]
    });
});

test('can update user', async () => {
    await userRepo.upsertUser(new User(0, 'Admiral', null, [0]));
    const expected = new User(0, 'NewAdmiral', null, [0]);
    await userRepo.upsertUser(expected);
    const user = await userRepo.getUser(expected.userId);

    expect(user).to.be.deep.equal(expected);
    expect(hrudbMock.getDb()).to.be.deep.equal({
        Users_0: [user]
    });
});

test('can join chat', async () => {
    const user = new User(0, 'Admiral', null, []);
    const chat = new Chat(0, 'testchat', []);
    await userRepo.upsertUser(user);
    await chatsRepo.upsertChat(chat);
    await chatsRepo.joinChat(user.userId, chat.chatId);
    const actualChat = await chatsRepo.getChat(0);

    expect(actualChat).to.be.deep.equal(chat);
    expect(hrudbMock.getDb()).to.be.deep.equal({
        Users_0: [user],
        Chats_0: [chat]
    });
});