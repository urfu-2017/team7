import Knex from 'knex';
import { expect, proxyquire } from '../helpers';
import { createTables } from '../../db/postgres/knex';
import { User, Chat, Message } from '../../db/datatypes';


let usersRepo;
let chatsRepo;
let loginUser;
let messagesRepo;

suite('Postgres.Repositories.Integration');

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

const user1 = new User(900, 'papa', '/avatar/900', []);
const user2 = new User(600, 'mama', '/avatar/600', []);
const chat = new Chat('11111117-287a-46ec-8c67-8cc0c89eb77c', 'чятик', [], '');
const msg1 = new Message(
    '21111117-287a-46ec-8c67-8cc0c89eb77c', new Date(), user1.userId,
    'privet1', 'privet1', chat.chatId
);

const msg2 = new Message(
    '31111117-287a-46ec-8c67-8cc0c89eb77c', new Date(), user1.userId,
    'paka1', 'paka1', chat.chatId
);

test('can login', async () => {
    await loginUser(user1.userId, user1.username);
    await loginUser(user2.userId, user2.username);
    const gotUser1 = await usersRepo.getUser(user1.userId);
    const gotUser2 = await usersRepo.getUser(user2.userId);

    expect(gotUser1).to.be.deep.equal(user1);
    expect(gotUser2).to.be.deep.equal(user2);
});

test('can join chat', async () => {
    await loginUser(user1.userId, user1.username);
    await loginUser(user2.userId, user2.username);
    await chatsRepo.upsertChat(chat);

    await chatsRepo.joinChat(user1.userId, chat.chatId);
    await chatsRepo.joinChat(user2.userId, chat.chatId);

    const {
        avatarUrl, chatId, name, userIds
    } = await chatsRepo.getChat(chat.chatId);
    expect({ avatarUrl, chatId, name }).to.be.deep.equal({
        avatarUrl: chat.avatarUrl,
        chatId: chat.chatId,
        name: chat.name
    });
    expect(userIds).to.have.deep.members([user1.userId, user2.userId]);
});

test('can send messages to chat', async () => {
    await loginUser(user1.userId, user1.username);
    await chatsRepo.upsertChat(chat);
    await chatsRepo.joinChat(user1.userId, chat.chatId);
    await messagesRepo.createMessage(msg1);
    await messagesRepo.createMessage(msg2);
    const gotMessages = await messagesRepo.getMessagesFromChat(chat.chatId);

    expect(gotMessages).to.be.deep.equal([msg1, msg2]);
});

test('can getAll users', async () => {
    await loginUser(user1.userId, user1.username);
    await loginUser(user2.userId, user2.username);
    const allUsers = await usersRepo.getAllUsers();

    expect(allUsers).to.be.deep.equal({
        [user1.userId]: user1.username,
        [user2.userId]: user2.username
    });
});

