import { expect, proxyquire, sandbox } from './helpers';
import { User, Chat } from '../hrudb/datatypes';
import * as hrudb from '../hrudb/hrudb-client';

suite('Repositories');

let userRepo;
let chatsRepo;

beforeEach(async () => {
    sandbox.stub(hrudb);
    userRepo = proxyquire('../hrudb/users-repository', {
        './hrudb-repeater': hrudb
    });
    chatsRepo = proxyquire('../hrudb/chats-repository', {
        './hrudb-repeater': hrudb,
        './users-repository': userRepo
    });
});

afterEach(async () => {
    sandbox.restore();
});

test('can create user', async () => {
    const user = new User(0, 'Admiral', null, [0]);
    await userRepo.upsertUser(user);

    expect(hrudb.put).to.be.calledWith('Users_0', user);
});

test('can update user', async () => {
    const user = new User(0, 'Admiral', null, [0]);
    await userRepo.upsertUser(user);
    const updatedUser = new User(0, 'NewAdmiral', null, [0]);
    await userRepo.upsertUser(updatedUser);

    expect(hrudb.put.getCalls().map(x => x.args)).to.be.deep.equal([
        ['Users_0', user],
        ['Users_0', updatedUser]
    ]);
});

test('can join chat', async () => {
    const user = new User(0, 'Admiral', null, []);
    const chat = new Chat(0, 'testchat', []);
    const updatedUser = new User(0, 'Admiral', null, [0]);
    const updatedChat = new Chat(0, 'testchat', [0]);
    hrudb.get.withArgs('Users_0').returns(user);
    hrudb.get.withArgs('Chats_0').returns(chat);
    await chatsRepo.joinChat(user.userId, chat.chatId);
    expect(hrudb.put).to.be.calledWith('Users_0', updatedUser);
    expect(hrudb.put).to.be.calledWith('Chats_0', updatedChat);
});
