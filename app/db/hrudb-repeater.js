import { Promise } from 'bluebird';
import * as hrudb from './hrudb-client';

const repeatTimes = 10;
const repeatRange = [...Array(repeatTimes)];

const tryResolve = async (promise) => {
    let resolved = false;
    let resolvedValue;
    await Promise.mapSeries(repeatRange, async () => {
        if (resolved) {
            return;
        }

        const response = await promise().catch(x => x);
        if (response && response.statusCode) {
            if (response.statusCode === 404) {
                throw response;
            }
            return;
        }
        resolvedValue = response;
        resolved = true;
    });

    if (!resolved) {
        throw new Error('Request failed');
    }
    return resolvedValue;
};

export const put = (key, value) => tryResolve(() => hrudb.put(key, value));

export const post = (key, value) => tryResolve(() => hrudb.post(key, value));

/*
    from           - моложе указанного таймстемпа (new Date().getTime())
    to             - старше указанного таймстемпа (new Date().getTime())
    sortByAlphabet – нужно ли сортировать по алфавиту
    limit          – в указанном количестве (по умолчанию, Infinity)
    offset         – с отступ от начала выборки (по умолчанию, 0)
*/
export const getAll = (key, options = {}) =>
    tryResolve(() => hrudb.getAll(key, options));

export const get = key => tryResolve(() => hrudb.get(key));

export const remove = key => tryResolve(() => hrudb.remove(key));

