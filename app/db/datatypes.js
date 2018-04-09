export class User {
    constructor(userId, username, avatarUrl, chatIds) {
        this.userId = userId;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.chatIds = chatIds;
    }
}

export class Chat {
    constructor(id, name, userIds, avatarUrl) {
        this.chatId = id;
        this.name = name;
        this.userIds = userIds;
        this.avatarUrl = avatarUrl;
    }
}

export class Message {
    constructor(messageId, timestamp, authorUserId, content, originalContent, chatId) {
        this.messageId = messageId;
        this.timestamp = timestamp;
        this.authorUserId = authorUserId;
        this.content = content;
        this.originalContent = originalContent;
        this.chatId = chatId;
    }
}
