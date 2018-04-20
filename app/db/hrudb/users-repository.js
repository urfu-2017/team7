import { put, get, getAll, remove } from './hrudb-repeater';

export const getAllUsers = async () => {
    const [allUsers] = await getAll('AllUsers');
    if (!allUsers) {
        return {};
    }

    return Object.entries(allUsers).reduce((result, [userId, [username]]) => {
        result[userId] = username; // eslint-disable-line no-param-reassign

        return result;
    }, {});
};

export const removeAllUsers = async () => remove('AllUsers');

export const getUser = async userId => get(`Users_${userId}`);

export const removeUser = async (userId) => {
    const allUsers = await getAllUsers();
    await remove(`Users_${userId}`);
    delete allUsers[userId];
    await put('AllUsers', allUsers);
};
