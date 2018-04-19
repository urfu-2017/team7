import got from 'got';
import config from '../../config';

const sendRequest = async (relativeUrl, method, body, query) => {
    const headers = {
        Authorization: config.HRUDB_TOKEN,
        'Content-Type': 'plain/text'
    };
    const options = {
        headers,
        method
    };
    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }
    if (query) {
        options.query = query;
    }

    const response = await got(config.HRUDB_URL + relativeUrl, options);
    return response.body;
};

const sendRequestJson = async (relativeUrl, method, body, query) =>
    JSON.parse(await sendRequest(relativeUrl, method, body, query));

export const put = (key, value) => sendRequest(`/storage/${key}`, 'PUT', value);

export const post = (key, value) => sendRequest(`/storage/${key}`, 'POST', value);

export const optionsToQuery = (options) => {
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
    return query;
};

/*
    from           - моложе указанного таймстемпа (new Date().getTime())
    to             - старше указанного таймстемпа (new Date().getTime())
    sortByAlphabet – нужно ли сортировать по алфавиту
    limit          – в указанном количестве (по умолчанию, Infinity)
    offset         – с отступ от начала выборки (по умолчанию, 0)
*/
export const getAll = async (key, options = {}) => {
    const query = optionsToQuery(options);
    const items = await sendRequestJson(`/storage/${key}/all`, 'GET', undefined, query);

    return items.map(x => JSON.parse(x));
};

export const get = key => sendRequestJson(`/storage/${key}`, 'GET');

export const remove = key => sendRequest(`/storage/${key}`, 'DELETE');

