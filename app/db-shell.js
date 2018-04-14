/* eslint-disable */
import prompt from 'synchro-prompt';
import { getAllUsers, deleteAllUsers, getUser } from './db/users-repository';
import { getMessagesFromChat } from './db/messages-repository';
import { getChat } from './db/chats-repository';

const ask = () => {
    console.log();
    return prompt('db-shell@> ', { color: 'green' });
};

const printJson = asyncHandler => async (...args) => {
    const obj = await asyncHandler(...args);
    console.log(JSON.stringify(obj, null, 4));
};

const lastUserMessages = async (userId, amount) => {
    const user = await getUser(userId);
    const chats = await Promise.all(user.chatIds.map(getMessagesFromChat));
    const messages = [].concat(...chats).filter(({ authorUserId }) => authorUserId === userId);
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    return messages.slice(0, amount).map(({ content }) => content);
}

const commands = [
    { name: 'users', desc: 'returns user index', handler: printJson(getAllUsers), argc: 0 },
    { name: 'delete_users', desc: 'deletes user index', handler: printJson(deleteAllUsers), argc: 0 },
    { name: 'messages', desc: 'getMessagesFromChat(chatId)', handler: printJson(getMessagesFromChat), argc: 1 },
    { name: 'user', desc: 'getUser(userId)', handler: printJson(getUser), argc: 1 },
    { name: 'chat', desc: 'getChat(chatId)', handler: printJson(getChat), argc: 1 },
    { name: 'exit', desc: 'Ctrl+C', handler: async () => process.exit(0), argc: 0 },
    { name: 'lum', desc: 'lastUserMessages(userId, amount)', handler: printJson(lastUserMessages), argc: 2 }
];

const list = async () => {
    console.log('\t', 'possible commands:');
    commands.forEach(({ name, desc }) => {
        console.log('\t', name, '->', desc);
    });
};

commands.push({ name: 'list', desc: 'view all commands', handler: list, argc: 0 });


const findCmd = (cmd, args) => {
    for (let { name, argc, handler } of commands) {
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
}

const asyncLoop = async () => {
    const line = ask();
    const [cmd, ...args] = line.split(' ');
    const handler = findCmd(cmd, args);
    if (!handler) {
        return;
    }
    await handler(...args);
};


export default async () => {
    console.log('print "list" to view all commands');
    while (true) {
        try {
            await asyncLoop();
        } catch(e) {
            console.error('An error occured');
            console.error(e.stack);
        }
    }
};
