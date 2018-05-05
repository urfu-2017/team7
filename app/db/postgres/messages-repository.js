import _ from 'lodash';
import { knex } from './knex';

const getMessagesByCondition = async (condition) => {
    let messages = await knex('message')
        .select('message.*', 'reactions.userId', 'reactions.reaction')
        .where(condition)
        .leftJoin('reactions', 'reactions.messageId', 'message.messageId');

    const reactions = _(messages).groupBy(m => m.messageId)
        .mapValues(m => m.reduce((result, message) => {
            if (message.userId) {
                result.push({ userId: message.userId, reaction: message.reaction });
            }

            return result;
        }, []))
        .value();

    messages = _.uniqBy(messages, x => x.messageId);

    return messages.map(({ userId, reaction, ...msg }) => ({
        ...msg, timestamp: new Date(msg.timestamp), reactions: reactions[msg.messageId]
    }));
};

export const createMessage = async ({ reactions, ...message }) => knex('message').insert(message);

export const getMessagesFromChat = async chatId => getMessagesByCondition({ chatId });

export const getMessage = async messageId => (await getMessagesByCondition({ 'message.messageId': messageId }))[0];

export const addReaction = async ({ messageId, userId, reaction }) =>
    knex('reactions').insert({ messageId, userId, reaction });

export const removeReaction = async ({ messageId, userId, reaction }) =>
    knex('reactions').where({ messageId, userId, reaction }).del();
