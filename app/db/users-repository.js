'use strict';

export class UsersRepository {
    constructor(hrudbClient) {
        this.hrudbClient = hrudbClient;
    }

    saveUser(user) {
        return this.hrudbClient.post('Users', user);
    }

    async getUser(userId) {
        const users = await this.hrudbClient.getAll('Users');
        console.info('users', users);
        return users.find(user => user.id === userId);
    }
}
