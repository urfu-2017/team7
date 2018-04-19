import { put, get, getAll, remove } from './hrudb-repeater';

export const upsertUser = async updatedUser => put(`Users_${updatedUser.userId}`, updatedUser);

export const getAllUsers = async () => {
    const [allUsers] = await getAll('AllUsers');
    return allUsers || {};
};

export const removeAllUsers = async () => remove('AllUsers');

export const getUser = async userId => get(`Users_${userId}`);

export const upsertAllUsers = async allUsers => put('AllUsers', allUsers);

export const removeUser = async (userId) => {
    const allUsers = await getAllUsers();
    await remove(`Users_${userId}`);
    delete allUsers[userId];
    await upsertAllUsers(allUsers);
};
