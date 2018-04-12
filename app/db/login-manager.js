import { upsertUser, getAllUsers, upsertAllUsers, getUser } from './users-repository';
import { User } from './datatypes';

export default async (id, username) => {
    const allUsers = await getAllUsers();
    const userExists = Boolean(allUsers[id]);
    const shouldUpdateUser = (allUsers[id] || {}).username !== username;

    if (shouldUpdateUser) {
        let user = new User(id, username, `/avatar/${id}`, []);
        if (userExists) {
            user = await getUser(id);
            user.username = username;
        }
        await upsertUser(user);
        allUsers[id] = username;
        await upsertAllUsers(allUsers);
    }
};
