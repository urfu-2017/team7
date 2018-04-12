import { put, get, getAll } from './hrudb-repeater';

export const upsertUser = async updatedUser => put(`Users_${updatedUser.userId}`, updatedUser);

export const getAllUsers = async () => {
    const [allUsers] = await getAll('AllUsers');
    return allUsers || {};
};

export const getUser = async userId => get(`Users_${userId}`);

export const upsertAllUsers = allUsers => put('AllUsers', allUsers);

