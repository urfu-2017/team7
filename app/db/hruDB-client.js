const { token } = require(__dirname + '/token');

const url = 'https://hrudb.herokuapp.com';
const got = require('got');

module.exports.putInStorage = function putInStorage(key, value) {
    return sendRequest(`/storage/${key}`, 'PUT', JSON.stringify(value));
}

module.exports.postInStorage = function postInStorage(key, value) {
    return sendRequest(`/storage/${key}`, 'POST', JSON.stringify(value));
}

module.exports.getAllFromStorage = function getAllFromStorage(key) {
    return sendRequest(`/storage/${key}/all`, 'GET');
}

module.exports.getLast = function getLast(key) {
    return sendRequest(`/storage/${key}`, 'GET');
}

module.exports.delete = function del(key) {
    return sendRequest(`/storage/${key}`, 'DELETE');
}

function sendRequest(relativeUrl, method, body) {
    const headers = {
        'Authorization': token,
        'Content-Type': 'plain/text'
    };
    const options = {
        headers,
        method,
        body
    };
    const fullUrl = url + relativeUrl;

    return got(fullUrl, options)
        .then(response => response.body)
        .catch(response => console.error(response));
}