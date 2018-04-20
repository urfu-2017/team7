import Knex from 'knex';
import { expect, proxyquire } from '../helpers';
import { createTables } from '../../db/postgres/knex';
import { User, Message } from '../../db/datatypes';


let usersRepo;
let chatsRepo;
let loginUser;
let messagesRepo;

suite('Knex.Repositories.Integration');

beforeEach(async () => {
    const knexInstance = await Knex({
        client: 'sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true
    });
    await createTables(knexInstance);
    const knex = (...args) => (args.length ? knexInstance(...args) : knexInstance);
    usersRepo = proxyquire('../db/postgres/users-repository', {
        './knex': { knex }
    });
    messagesRepo = proxyquire('../db/postgres/messages-repository', {
        './knex': { knex }
    });
    chatsRepo = proxyquire('../db/postgres/chats-repository', {
        './knex': { knex }
    });
    loginUser = proxyquire('../db/postgres/login-manager', {
        './knex': { knex },
        './users-repository': usersRepo
    }).default;
});

const user1 = new User('91111117-287a-46ec-8c67-8cc0c89eb77c', 900, 'papa', '/avatar/900', []);
const user2 = new User('10111117-287a-46ec-8c67-8cc0c89eb77c', 600, 'mama', '/avatar/600', []);

test('can login thru github', async () => {
    const userId1 = await loginUser(user1.githubId, user1.username);
    const userId2 = await loginUser(user2.githubId, user2.username);
    const gotUser1 = await usersRepo.getUser(userId1);
    const gotUser2 = await usersRepo.getUser(userId2);

    expect(gotUser1).to.be.deep.equal(Object.assign({}, user1, { userId: gotUser1.userId }));
    expect(gotUser2).to.be.deep.equal(Object.assign({}, user2, { userId: gotUser2.userId }));
});

test('can join chat', async () => {
    const userId1 = await loginUser(user1.githubId, user1.username);
    const userId2 = await loginUser(user2.githubId, user2.username);
    const chat = await chatsRepo.createChat('чятик', 'avatarUrl');

    await chatsRepo.joinChat(userId1, chat.chatId);
    await chatsRepo.joinChat(userId2, chat.chatId);

    const {
        avatarUrl, chatId, name, userIds
    } = await chatsRepo.getChat(chat.chatId);
    expect({ avatarUrl, chatId, name }).to.be.deep.equal({
        avatarUrl: chat.avatarUrl,
        chatId: chat.chatId,
        name: chat.name
    });
    expect(userIds).to.have.deep.members([userId1, userId2]);
});

test('can send messages to chat', async () => {
    const userId1 = await loginUser(user1.githubId, user1.username);
    const chat = await chatsRepo.createChat('чятик', 'avatarUrl');
    await chatsRepo.joinChat(userId1, chat.chatId);
    const msg1 = new Message(
        '21111117-287a-46ec-8c67-8cc0c89eb77c', new Date(), userId1,
        'privet1', 'privet1', chat.chatId
    );
    const msg2 = new Message(
        '31111117-287a-46ec-8c67-8cc0c89eb77c', new Date(), userId1,
        'paka1', 'paka1', chat.chatId
    );
    await messagesRepo.createMessage(msg1);
    await messagesRepo.createMessage(msg2);
    const gotMessages = await messagesRepo.getMessagesFromChat(chat.chatId);

    expect(gotMessages).to.be.deep.equal([msg1, msg2]);
});

test('can getAll users', async () => {
    const userId1 = await loginUser(user1.githubId, user1.username);
    const userId2 = await loginUser(user2.githubId, user2.username);
    const allUsers = await usersRepo.getAllUsers();

    expect(allUsers).to.be.deep.equal({
        [userId1]: user1.username,
        [userId2]: user2.username
    });
});

