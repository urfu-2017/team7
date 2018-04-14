import { Promise } from 'bluebird';
import * as hrudb from './hrudb-client';
import { REPEATER_TIMES } from '../utils/constants';
import getLogger from '../utils/logger';

const logger = getLogger('hrudb');
const repeatTimes = REPEATER_TIMES;
const repeatRange = [...Array(repeatTimes)];

const tryResolve = async (opts, promise) => {
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
        logger.debug('Hrudb request failed', opts);
        throw new Error('Request failed');
    }
    return resolvedValue;
};

export const put = async (key, value) =>
    tryResolve({ key, value, method: 'put' }, () => hrudb.put(key, value));

export const post = async (key, value) =>
    tryResolve({ key, value, method: 'post' }, () => hrudb.post(key, value));

/*
    from           - моложе указанного таймстемпа (new Date().getTime())
    to             - старше указанного таймстемпа (new Date().getTime())
    sortByAlphabet – нужно ли сортировать по алфавиту
    limit          – в указанном количестве (по умолчанию, Infinity)
    offset         – с отступ от начала выборки (по умолчанию, 0)
*/
export const getAll = async (key, options = {}) =>
    tryResolve({ key, method: 'getAll', options }, () => hrudb.getAll(key, options));

export const get = async key => tryResolve({ key, method: 'get' }, () => hrudb.get(key));

export const remove = async key => tryResolve({ key, method: 'remove' }, () => hrudb.remove(key));

