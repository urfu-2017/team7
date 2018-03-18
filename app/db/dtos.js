class User {
    constructor(id, name, avatarUrl, chats) {
        this.id = id;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.chats = chats;
    }
}

class Chat {
    constructor(id, name, users) {
        this.id = id;
        this.name = name;
        this.users = users;
    }
}

class Message {
    constructor(id, timestamp, author, content, originalContent, recepientChat) {
        this.id = id;
        this.timestamp = timestamp;
        this.author = author;
        this.content = content;
        this.originalContent = originalContent;
        this.recepientChat = recepientChat;
    }
}
