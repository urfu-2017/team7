import { getAll, put } from './hrudb-repeater';

export const upsertUser = async (updatedUser) => {
    let users = await getAll('Users');
    if (users.length !== 0) {
        [users] = users;
    }
    const userInDb = users.find(x => x.userId === updatedUser.userId);
    if (userInDb) {
        const index = users.indexOf(userInDb);
        users[index] = updatedUser;
        await put('Users', users);
    } else {
        users.push(updatedUser);
        await put('Users', users);
    }
};

export const getUser = async (userId) => {
    const users = await getAll('Users');
    return users.length === 0
        ? null
        : users[0].find(user => user.userId === userId) || null;
};
