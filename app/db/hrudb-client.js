import got from 'got';
import config from '../config';

const url = 'https://hrudb.herokuapp.com';

const sendRequest = async (relativeUrl, method, body) => {
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

    const response = await got(url + relativeUrl, options);
    return response.body;
};

const sendRequestJson = async (relativeUrl, method, body) =>
    JSON.parse(await sendRequest(relativeUrl, method, body));

export const put = (key, value) => sendRequest(`/storage/${key}`, 'PUT', value);

export const post = (key, value) => sendRequest(`/storage/${key}`, 'POST', value);

export const getAll = async (key) => {
    const items = await sendRequestJson(`/storage/${key}/all`, 'GET');

    return items.map(x => JSON.parse(x));
};

export const get = key => sendRequestJson(`/storage/${key}`, 'GET');

export const remove = key => sendRequest(`/storage/${key}`, 'DELETE');

