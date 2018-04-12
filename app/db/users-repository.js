import { put, get, getAll } from './hrudb-repeater';

export const upsertUser = async updatedUser => put(`Users_${updatedUser.userId}`, updatedUser);

export const getAllUsers = async () => {
    const allUsersRef = await getAll('AllUsers');
    return allUsersRef.length ? allUsersRef[0] : {};
};

export const getUser = async userId => get(`Users_${userId}`);

export const upsertUserWithIndex = async (updatedUser) => {
    const allUsers = await getAllUsers();
    const user = allUsers[updatedUser.userId] || {};
    const nameChanged = user.username !== updatedUser.username;
    await upsertUser(updatedUser);
    if (nameChanged) {
        allUsers[updatedUser.userId] = updatedUser.username;
        await put('AllUsers', allUsers);
    }
};

