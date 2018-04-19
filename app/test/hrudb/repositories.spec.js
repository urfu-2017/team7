import { expect, proxyquire, sandbox } from '../helpers';
import { User, Chat } from '../../db/datatypes';
import * as hrudb from '../../db/hrudb/hrudb-client';

suite('Hrudb.Repositories');

let userRepo;
let chatsRepo;

beforeEach(async () => {
    sandbox.stub(hrudb);
    userRepo = proxyquire('../db/hrudb/users-repository', {
        './hrudb-repeater': hrudb
    });
    chatsRepo = proxyquire('../db/hrudb/chats-repository', {
        './hrudb-repeater': hrudb,
        './users-repository': userRepo
    });
});

afterEach(async () => {
    sandbox.restore();
});

test('can getAllUsers', async () => {
    hrudb.getAll.withArgs('AllUsers').returnsAsync([{ kekId: ['username', 'githubId'] }]);
    const allUsers = await userRepo.getAllUsers();

    expect(allUsers).to.be.deep.equal({ kekId: 'username' });
});

test('can join chat', async () => {
    const user = new User(0, 'githubId', 'Admiral', null, []);
    const chat = new Chat(0, 'testchat', []);
    const updatedUser = new User(0, 'githubId', 'Admiral', null, [0]);
    const updatedChat = new Chat(0, 'testchat', [0]);
    hrudb.get.withArgs('Users_0').returns(user);
    hrudb.get.withArgs('Chats_0').returns(chat);
    await chatsRepo.joinChat(user.userId, chat.chatId);
    expect(hrudb.put).to.be.calledWith('Users_0', updatedUser);
    expect(hrudb.put).to.be.calledWith('Chats_0', updatedChat);
});
