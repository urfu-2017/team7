import { put, get } from './hrudb-repeater';

export const upsertUser = async updatedUser => put(`Users_${updatedUser.userId}`, updatedUser);

export const getAllUsers = () => get('AllUsers').catch(() => ({}));

export const getUser = async userId => get(`Users_${userId}`);

export const upsertUserWithIndex = async (updatedUser) => {
    const user = await getUser(updatedUser.userId).catch(() => ({}));
    const nameChanged = user.username !== updatedUser.username;
    if (nameChanged) {
        const allUsers = await getAllUsers();
        allUsers[updatedUser.userId] = updatedUser.username;
        await put('AllUsers', allUsers);
    }
    await upsertUser(updatedUser);
};

