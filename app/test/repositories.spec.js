import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { User, Chat, Message } from '../db/datatypes';


describe.skip('Repositories', async () => {
    const testToken = '8f92d8b92cffc5d2c4ddb2af9959dfa9391b6f43';
    const hrudb = proxyquire('../db/hrudb-client', {
        '../config': {
            default: {
                HRUDB_TOKEN: testToken,
                HRUDB_URL: 'https://hrudb.herokuapp.com'
            }
        }
    });
    const userRepo = proxyquire('../db/users-repository', {
        './hrudb-client': hrudb
    });
    const chatsRepo = proxyquire('../db/chats-repository', {
        './hrudb-client': hrudb,
        './users-repository': userRepo
    });

    beforeEach(async () => {
        await hrudb.remove('Chats_0');
    });

    it('can do somthing', async () => {
        const user = new User(0, "Admiral", "", [0]);
        const chat = new Chat(0, "testchat", [0]);
        await chatsRepo.createChat(chat);
        const chats = await chatsRepo.getAllChatsForUser(user.id);

        expect(chats).to.have.lengthOf(1);
        expect(chats[0]).to.be.deep.equal(chat);
    });
});
