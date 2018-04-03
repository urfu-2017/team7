const express = require('express');
const next = require('next');
const socketServer = require('./sockets/server');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        server.get('/a', (req, res) => app.render(req, res, '/b', req.query));

        server.get('/b', (req, res) => app.render(req, res, '/a', req.query));

        server.get('/posts/:id', (req, res) => app.render(req, res, '/posts', { id: req.params.id }));

        server.get('*', (req, res) => handle(req, res));
        server.get('/posts/:id', (req, res) => app.render(req, res, '/posts', { id: req.params.id }));

        socketServer.listen(server);
        server.listen(port, (err) => {
            if (err) {
                throw err;
            }

            // eslint-disable-next-line no-console
            console.log(`> Ready on http://localhost:${port}`);
        });
    });
