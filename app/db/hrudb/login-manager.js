import uuidv4 from 'uuid/v4';
import { User } from '../datatypes';
import { getAll, put } from './hrudb-repeater';


export default async (githubId, username) => {
    let [allUsers] = await getAll('AllUsers');
    allUsers = allUsers || {};
    const userInIndex = Object.entries(allUsers).find(([, [, gid]]) => gid === githubId);
    if (userInIndex) {
        return userInIndex[0];
    }
    const userId = uuidv4();
    const user = new User(userId, githubId, username, `/avatar/${githubId}`);
    await put(`Users_${userId}`, user);
    await put('AllUsers', allUsers);

    return userId;
};
