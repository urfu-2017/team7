'use strict';

import { HrudbClient } from '../db/hrudb-client';
import { ChatsRepository } from '../db/chats-repository';
import { User, Chat, Message } from '../db/datatypes';
import { MessagesRepository } from '../db/messages-repository';
import { UsersRepository } from '../db/users-repository';
import { expect } from 'chai';

describe('Repositories', async () => {
    const testToken = '8f92d8b92cffc5d2c4ddb2af9959dfa9391b6f43';
    const hrudb = new HrudbClient(testToken);
    const userRepo = new UsersRepository(hrudb);
    const chatsRepo = new ChatsRepository(hrudb, userRepo);

    beforeEach(async () => {
        await hrudb.remove('Chats_0');
    })

    it('can do somthing', async () => {
        const user = new User(0, "Admiral", "", [0]);
        const chat = new Chat(0, "testchat", [0]);
        await chatsRepo.createChat(chat);
        const chats = await chatsRepo.getAllChatsForUser(user.id);

        expect(chats).to.have.lengthOf(1);
        expect(chats[0]).to.be.deep.equal(chat);
    })
});
