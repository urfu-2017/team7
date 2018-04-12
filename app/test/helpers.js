import * as hrudbMock from '../db/hrudb-client.mock';

export const okResponse = () => new hrudbMock.Response(200, 'ok');

export const badResponse = () => new hrudbMock.Response(418, 'teapot');

export const okResponses = amount => [...Array(amount)].map(okResponse);

export const badResponses = amount => [...Array(amount)].map(badResponse);

export const rotateResponses = amount =>
    [...Array(amount).keys()].map(x => (x % 2 ? okResponse() : badResponse()));
