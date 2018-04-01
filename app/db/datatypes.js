'use strict';

export class User {
    constructor(id, name, avatarUrl, chats) {
        this.id = id;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.chats = chats;
    }
}

export class Chat {
    constructor(id, name, users) {
        this.id = id;
        this.name = name;
        this.users = users;
    }
}

export class Message {
    constructor(id, timestamp, author, content, originalContent, recipientChat) {
        this.id = id;
        this.timestamp = timestamp;
        this.author = author;
        this.content = content;
        this.originalContent = originalContent;
        this.recipientChat = recipientChat;
    }
}
