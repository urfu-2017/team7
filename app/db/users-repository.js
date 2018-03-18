const dbClient = require('./hruDB-client');

class UsersRepository {
    static saveUser(user) {
        return dbClient.postInStorage('Users', user);
    }

    static getUser(userId) {
        return dbClient.getAllFromStorage('Users')
            .then(users => users.find(user => user.id === userId));
    }
}

module.exports = UsersRepository;