export default class UsersRepository {
    constructor(hrudbClient) {
        this.hrudbClient = hrudbClient;
    }

    saveUser(user) {
        return this.hrudbClient.post('Users', user);
    }

    async getUser(userId) {
        const users = await this.hrudbClient.getAll('Users');

        return users.find(user => user.id === userId);
    }
}
