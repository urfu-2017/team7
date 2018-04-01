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

    async getAll(key) {
        const items = JSON.parse(await this.sendRequest(`/storage/${key}/all`, 'GET'));

        return items.map(x => JSON.parse(x));
    }

    async get(key) {
        const items = JSON.parse(await this.sendRequest(`/storage/${key}`, 'GET'));

        return items;
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
