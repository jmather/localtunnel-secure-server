const cli = require('cli');
import ltServerBuilder from 'localtunnel-server/server';
import secureLtServerBuilder from './server';
const optsHelper = require('./options');
const https = require('https');
const fs = require('fs');
const uuid = require('uuid');
const debug = require('debug')('localtunnel-secure-server:cli');
const path = require('path');

const certPath = path.relative(process.cwd(), __dirname + '/../cert/server-cert.pem');
const keyPath = path.relative(process.cwd(), __dirname + '/../cert/server-key.pem');


cli.parse({
    address: ['a', 'Address to bind to (e.g. localhost, 127.0.0.1)', 'string', '127.0.0.1'],
    port: ['p', 'Port to bind to', 'number', '4443'],
    domain: ['d', 'Domain to use as the root for tunnels', 'string', 'localtest.me'],
    cert: [null, 'SSL Certificate to use', 'file', certPath],
    key: ['k', 'SSL Private Key to use', 'file', keyPath],
    secret: ['s', 'Secret to require', 'string', null],
    secure: ['S', 'Run with ssl', 'bool', true],
    sockets: ['m', 'Max sockets', 'number', 10],
});

process.on('SIGINT', () => {
    process.exit();
});

process.on('SIGTERM', () => {
    process.exit();
});

process.on('uncaughtException', (err) => {
    cli.output('Error', err);
});

process.on('unhandledRejection', (reason, promise) => {
    cli.output('Error', reason);
});

cli.main((args, opts) => {
    debug('opts', opts);

    const hasCert = (opts.cert && opts.key);
    let server = null;

    if (hasCert === false || opts.secure === false) {
        server = ltServerBuilder(optsHelper.localTunnelOptions(opts));
    } else {
        server = secureLtServerBuilder(opts);
    }

    server.listen(opts.port, opts.address, () => {
        const protocol = (opts.secure) ? 'https' : 'http';
        cli.output(`server listening at ${protocol}://${server.address().address}:${server.address().port}`);
    });
});