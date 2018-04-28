import { knex } from './knex';

export const createMessage = async ({
    messageId,
    timestamp,
    authorUserId,
    content,
    originalContent,
    chatId
}) => knex('message').insert({
    messageId, timestamp, authorUserId, content, originalContent, chatId
});

export const getMessagesFromChat = async (chatId) => {
    const messages = await knex('message')
        .select('message.*', 'reactions.userId', 'reactions.reaction')
        .where({ chatId })
        .leftJoin('reactions', 'reactions.messageId', 'message.messageId');

    const reactions = messages.reduce((result, message) => {
        if (!result[message.messageId]) {
            result[message.messageId] = []; // eslint-disable-line no-param-reassign
        }
        if (message.userId) {
            result[message.messageId].push({
                userId: message.userId, reaction: message.reaction
            });
        }

        return result;
    }, {});

    messages.forEach((msg) => {
        delete msg.userId; // eslint-disable-line no-param-reassign
        delete msg.reaction; // eslint-disable-line no-param-reassign
    });

    return messages.map(msg => ({
        ...msg, timestamp: new Date(msg.timestamp), reactions: reactions[msg.messageId]
    }));
};

export const getMessage = async (messageId) => {
    const messages = await knex('message')
        .select('message.*', 'reactions.userId', 'reactions.reaction')
        .where({ 'message.messageId': messageId })
        .leftJoin('reactions', 'reactions.messageId', 'message.messageId');

    const reactions = messages.reduce((result, msg) => {
        if (msg.userId) {
            result.push({ userId: msg.userId, reaction: msg.reaction });
        }
        delete msg.userId; // eslint-disable-line no-param-reassign
        delete msg.reaction; // eslint-disable-line no-param-reassign

        return result;
    }, []);

    return messages.map(msg => ({
        ...msg, timestamp: new Date(msg.timestamp), reactions
    }))[0];
};

export const addReaction = async ({ messageId, userId, reaction }) =>
    knex('reactions').insert({ messageId, userId, reaction });

export const removeReaction = async ({ messageId, userId, reaction }) =>
    knex('reactions').where({ messageId, userId, reaction }).del();
