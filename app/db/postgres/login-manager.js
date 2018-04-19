import { knex } from './knex';

export default async (githubId, username) => {
    let [user] = await knex('user').where({ githubId }).select('userId');
    if (!user) {
        user = await knex('user')
            .insert({ githubId, username, avatarUrl: `/avatar/${githubId}` })
            .returning('userId');
    }

    return user.userId;
};
