const dbClient = require('./hruDBClient');

module.exports.UsersRepository = class UsersRepository {
    static saveUser(user) {
        return dbClient.postInStorage('Users', user);
    }

    static getUser(userId) {
        return dbClient.getAllFromStorage('Users')
            .then(users => users.find(user => user.id === id));
    }
}
