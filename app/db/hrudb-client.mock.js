import { optionsToQuery } from './hrudb-client';

let db = {};
let fakeResponses = [];

export const setResponses = (responses) => { fakeResponses = responses; };

export const getDb = () => db;

export const clearDb = () => {
    db = {};
};

export const setDb = (newDb) => {
    db = newDb;
};

export class Response {
    constructor(statusCode, description) {
        this.statusCode = statusCode;
        this.description = description;
    }
}

const simulateRequest = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        const response = fakeResponses.pop();
        if (response.statusCode === 418) {
            reject(response);
        }
        resolve(response);
    }, 1);
});

export const put = async (key, value) => {
    await simulateRequest();
    db[key] = [value];
};

export const post = async (key, value) => {
    await simulateRequest();
    db[key] = db[key] || [];
    db[key].push(value);
};

/*
    from           - моложе указанного таймстемпа (new Date().getTime())
    to             - старше указанного таймстемпа (new Date().getTime())
    sortByAlphabet – нужно ли сортировать по алфавиту
    limit          – в указанном количестве (по умолчанию, Infinity)
    offset         – с отступ от начала выборки (по умолчанию, 0)
*/
export const getAll = async (key, options = {}) => {
    await simulateRequest();
    // TODO: допилить если надо
    // eslint-disable-next-line no-unused-vars
    const query = optionsToQuery(options);

    return db[key] || [];
};

export const get = async (key) => {
    await simulateRequest();
    if (!db[key]) {
        throw new Response(404, `no '${key}' key`);
    }

    const values = db[key];
    return values[values.length - 1];
};

export const remove = async (key) => {
    await simulateRequest();
    delete db[key];
};

