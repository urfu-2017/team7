import { put, get, getAll, remove } from './hrudb-repeater';

export const getAllUsers = async () => {
    const [allUsers] = await getAll('AllUsers');
    const result = {};
    if (!allUsers) {
        return {};
    }
    Object.entries(allUsers).forEach(([userId, [username]]) => {
        result[userId] = username;
    });
    return result;
};

export const removeAllUsers = async () => remove('AllUsers');

export const getUser = async userId => get(`Users_${userId}`);

export const removeUser = async (userId) => {
    const allUsers = await getAllUsers();
    await remove(`Users_${userId}`);
    delete allUsers[userId];
    await put('AllUsers', allUsers);
};
