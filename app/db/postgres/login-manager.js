import uuidv4 from 'uuid/v4';
import { knex } from './knex';


export default async (githubId, username) => {
    const [user] = await knex('user').where({ githubId }).select('userId');
    if (user) {
        return user.userId;
    }
    const userId = uuidv4();
    await knex('user').insert({
        userId, githubId, username, avatarUrl: `/avatar/${githubId}`
    });
    return userId;
};
