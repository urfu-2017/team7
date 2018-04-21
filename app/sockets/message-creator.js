import uuidv4 from 'uuid/v4';
import { logger } from './handlers';
import { messagesRepo } from '../db';
import { MAX_MESSAGE_LENGTH } from '../utils/constants';
import * as eventNames from './event-names';
import { Message } from '../db/datatypes';

// eslint-disable-next-line import/prefer-default-export
export const createMessage = async (socket, text, currentUserId, chatId) => {
    const truncatedText = text.substring(0, MAX_MESSAGE_LENGTH);
    const message = new Message(
        uuidv4(), new Date(),
        currentUserId, truncatedText,
        truncatedText, chatId
    );
    socket.emit(eventNames.server.MESSAGE_SENT, message);

    try {
        await messagesRepo.createMessage(message);
        socket.broadcast.to(message.chatId).emit(eventNames.server.MESSAGE, message);
        socket.emit(eventNames.server.MESSAGE_RECEIVED, message);
    } catch (e) {
        logger.warn(e, `Failed to save message '${message.content}' in db`);
        socket.emit(eventNames.server.MESSAGE_REVOKED, message);
    }
};
