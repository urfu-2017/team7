import { getAll, put } from './hrudb-repeater';

export const upsertUser = async (updatedUser) => {
    let users = await getAll('Users');
    if (users.length) {
        [users] = users;
    }
    const userIndex = users.findIndex(x => x.userId === updatedUser.userId);
    if (userIndex >= 0) {
        users[userIndex] = updatedUser;
        await put('Users', users);
    } else {
        users.push(updatedUser);
        await put('Users', users);
    }
};

export const getUser = async (userId) => {
    const users = await getAll('Users');
    return users.length
        ? users[0].find(user => user.userId === userId) || null
        : null;
};
