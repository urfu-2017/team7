import { post, getAll } from './hrudb-client';
import { User } from './datatypes';

export const getAllUsers = () => getAll('Users');
export const saveUser = user => post('Users', user);
export const getUser = async (userId) => {
    const users = await getAllUsers();

    return users.find(user => user.id === userId);
};

export const createIfNotExists = async (username, id) => {
    let user = await getUser(id);
    if (!user) {
        user = new User(id, username, null, []);
        await saveUser(user);
    }

    return user;
};
