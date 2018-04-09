import { put, get } from './hrudb-repeater';

export const upsertUser = async updatedUser => put(`Users_${updatedUser.userId}`, updatedUser);
export const getUser = async userId => get(`Users_${userId}`);
