'use strict';

const url = 'https://hrudb.herokuapp.com';
import got from 'got';

export class HrudbClient {
    constructor(token) {
        this.token = token;
    }

    put(key, value) {
        return this.sendRequest(`/storage/${key}`, 'PUT', value);
    }

    post(key, value) {
        return this.sendRequest(`/storage/${key}`, 'POST', value);
    }

    getAll(key) {
        return this.sendRequestJson(`/storage/${key}/all`, 'GET');
    }

    get(key) {
        return this.sendRequestJson(`/storage/${key}`, 'GET');
    }

    remove(key) {
        return this.sendRequest(`/storage/${key}`, 'DELETE');
    }

    async sendRequest(relativeUrl, method, body) {
        const headers = {
            'Authorization': this.token,
            'Content-Type': 'plain/text'
        };
        const options = {
            headers,
            method
        };
        if (body !== undefined)
            options.body = JSON.stringify(body);

        const response = await got(url + relativeUrl, options);
        return response.body;
    }
}
