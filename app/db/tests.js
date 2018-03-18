const chatsRepo = require('./chats-repository');
const messagesRepo = require('./messages-repository');
const usersRepo = require('./users-repository');

const {User, Chat, Message} = require('./dtos');

const user = new User(0, "Admiral", "", [0]);
const chat = new Chat(0, "testchat", [0]);
usersRepo.saveUser(user);
chatsRepo.createChat(chat);
chatsRepo.getAllChatsForUser(user.id)
    .then(console.info)
    .catch(console.info);
