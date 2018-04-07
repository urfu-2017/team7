let shouldFailRequest = false;
const db = {};

class Response extends Error {
    constructor(statusCode) {
        super(`Response ${statusCode}`);
        this.statusCode = statusCode;
    }
}

const throwStatus = (statusCode) => {
    throw new Response(statusCode);
};

const tryFailRequest = () => {
    if (shouldFailRequest) {
        shouldFailRequest = false;
        throwStatus(418);
    }
    shouldFailRequest = true;
};

export const put = async (key, value) => {
    tryFailRequest();
    db[key] = value;
};

export const post = async (key, value) => {
    tryFailRequest();
    if (!db[key]) {
        db[key] = [];
    }
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
    tryFailRequest();
    const query = Object.assign({}, options);
    Object.keys(options).forEach((x) => {
        if (query[x] === undefined) {
            delete query[x];
        }
    });
    if (query.sortByAlphabet) {
        query.sort = 'alph';
    }
    delete query.sortByAlphabet;
    if (!db[key]) {
        return [];
    }
    return db[key];
};

export const get = async (key) => {
    tryFailRequest();
    if (!db[key]) {
        throwStatus(404);
    }

    const values = db[key];
    return values[values.length - 1];
};

export const remove = async (key) => {
    tryFailRequest();
    delete db[key];
};

