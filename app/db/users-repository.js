import { post, getAll } from './hrudb-client';

export const saveUser = user => post('Users', user);
export const getUser = async (userId) => {
    const users = await getAll('Users');

    return users.find(user => user.id === userId);
};
