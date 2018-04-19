import * as chatsRepo from './chats-repository';
import * as usersRepo from './users-repository';
import * as messagesRepo from './messages-repository';
import loginUser from './login-manager';
import { connect } from './knex';

module.exports = {
    chatsRepo,
    usersRepo,
    messagesRepo,
    loginUser,
    connect
};
