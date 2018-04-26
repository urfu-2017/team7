/* eslint-disable */
import inquirer from 'inquirer';
import inquirerCommandPrompt from 'inquirer-command-prompt';
import { usersRepo, messagesRepo, chatsRepo, connect } from './db';


const { getAllUsers, removeAllUsers, getUser, removeUser } = usersRepo;
const { getMessagesFromChat } = messagesRepo;
const { getChatForUser, createPrivateChat } = chatsRepo;

inquirer.registerPrompt('command', inquirerCommandPrompt);

const printJson = asyncHandler => async (...args) => {
    const obj = await asyncHandler(...args);
    console.log(JSON.stringify(obj, null, 4));
};

const lastUserMessages = async (userId, amount) => {
    const user = await getUser(userId);
    const chats = await Promise.all(user.chatIds.map(getMessagesFromChat));
    const messages = [].concat(...chats).filter(({ authorUserId }) => authorUserId === userId);
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return messages.slice(0, amount).map(({ content }) => content);
};

const commands = [
    { name: 'users', desc: 'returns user index', handler: printJson(getAllUsers), argc: 0 },
    { name: 'rm_users', desc: 'clears user index', handler: printJson(removeAllUsers), argc: 0 },
    { name: 'messages', desc: 'getMessagesFromChat(chatId)', handler: printJson(getMessagesFromChat), argc: 1 },
    { name: 'user', desc: 'getUser(userId)', handler: printJson(getUser), argc: 1 },
    { name: 'chat', desc: 'getChatForUser(userId, chatId)', handler: printJson(getChatForUser), argc: 2 },
    { name: 'exit', desc: 'Ctrl+C', handler: async () => process.exit(0), argc: 0 },
    { name: 'lum', desc: 'lastUserMessages(userId, amount)', handler: printJson(lastUserMessages), argc: 2 },
    { name: 'rm_user', desc: 'removeUser(userId)', handler: printJson(removeUser), argc: 1 },
    { name: 'pm', desc: 'createPrivateChat(userId1, userId2)', handler: printJson(createPrivateChat), argc: 2 }
];

const autoCompletion = commands.map(x => x.name);

const list = async () => {
    console.log('\t', 'possible commands:');
    commands.forEach(({ name, desc }) => {
        console.log('\t', name, '->', desc);
    });
};

commands.push({ name: 'list', desc: 'view all commands', handler: list, argc: 0 });


const findCmd = (cmd, args) => {
    for (const { name, argc, handler } of commands) {
        if (name !== cmd) {
            continue;
        }
        if (argc !== args.length) {
            console.error(`Expected ${argc} arguments, but met ${args.length}`);
            return;
        }
        return handler;
    }
    console.error(`No such command: ${cmd}`);
};

const asyncLoop = async () => {
    const { line } = await inquirer.prompt([{
          type: 'command',
          name: 'line',
          message: 'db-shell@>',
          autoCompletion
    }]);
    const [cmd, ...args] = line.split(' ');
    const handler = findCmd(cmd, args);
    if (!handler) {
        return;
    }
    await handler(...args);
};


export const run = async () => {
    await connect();
    console.log('print "list" to view all commands');
    while (true) {
        try {
            await asyncLoop();
        } catch (e) {
            console.error('An error occured');
            console.error(e.stack);
        }
    }
};

if (require.main === module) {
    run();
}
