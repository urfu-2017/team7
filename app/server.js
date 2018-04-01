const express = require('express');
const next = require('next');
const authRouter = require('./routers/auth');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { HOSTNAME, PORT, HOST } = require('./constants');

app.prepare()
    .then(() => {
        const server = express();

        authRouter(server);

        server.get('/b', (req, res) => app.render(req, res, '/a', req.query));

        server.get('/posts/:id', (req, res) => app.render(req, res, '/posts', { id: req.params.id }));

        server.get('*', (req, res) => handle(req, res));

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(PORT, HOSTNAME, (err) => {
            if (err) {
                throw err;
            }

            console.log(`> Ready on http://${HOST}`);
        });
    });
