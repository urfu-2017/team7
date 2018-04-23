export class User {
    constructor(userId, githubId, username, avatarUrl, chatIds) {
        this.userId = userId;
        this.githubId = githubId;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.chatIds = chatIds;
    }
}

export class Chat {
    constructor(chatId, name, userIds, avatarUrl) {
        this.chatId = chatId;
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
