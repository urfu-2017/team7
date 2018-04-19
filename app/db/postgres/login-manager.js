import { User } from '../datatypes';
import { upsertUser } from './users-repository';

export default async (id, username) => upsertUser(new User(id, username, `/avatar/${id}`, []));
