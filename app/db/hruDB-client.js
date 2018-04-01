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
        const items = await this.sendRequestJson(`/storage/${key}/all`, 'GET');

        return items.map(x => JSON.parse(x));
    }

    get(key) {
        return this.sendRequestJson(`/storage/${key}`, 'GET');
    }

    remove(key) {
        return this.sendRequest(`/storage/${key}`, 'DELETE');
    }

    async sendRequestJson(relativeUrl, method, body) {
        return JSON.parse(await this.sendRequest(relativeUrl, method, body));
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
