import * as hrudb from './hrudb-client';

const repeatTimes = 5;

const tryResolve = (depth, promise) => {
    if (depth <= 0) {
        return Promise.reject();
    }
    return new Promise((resolve) => {
        promise().then(resolve, () => tryResolve(depth - 1, promise));
    });
};

export const put = (key, value) => tryResolve(repeatTimes, () => hrudb.put(key, value));

export const post = (key, value) => tryResolve(repeatTimes, () => hrudb.post(key, value));

/*
    from           - моложе указанного таймстемпа (new Date().getTime())
    to             - старше указанного таймстемпа (new Date().getTime())
    sortByAlphabet – нужно ли сортировать по алфавиту
    limit          – в указанном количестве (по умолчанию, Infinity)
    offset         – с отступ от начала выборки (по умолчанию, 0)
*/
export const getAll = (key, options = {}) =>
    tryResolve(repeatTimes, () => hrudb.getAll(key, options));

export const get = key => tryResolve(repeatTimes, () => hrudb.get(key));

export const remove = key => tryResolve(repeatTimes, () => hrudb.remove(key));

