const https = require('https');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('localtunnel-secure-server:server');
const cli = require('cli');
const uuid = require('uuid');
import ltServerBuilder from "localtunnel-server/server";
const optsHelper = require('./options');

/**
 * @typedef {Object} LocalTunnelSecureServer
 * @property {string} address IP or Host to listen on
 * @property {number} port Port to listen on
 * @property {string} domain Domain to generate temp domains under
 * @property {string} cert SSL Certificate
 * @property {string} key SSL Certificate Key
 * @property {string} secret Shared secret required to create tunnels.
 * @property {boolean} secure Enable https
 * @property {number} sockets Maximum number of sockets (default: 10)
 */

/**
 *
 * @param {LocalTunnelSecureServer} options
 * @returns {Server}
 */
export default function(options) {
    const ltServer = ltServerBuilder(optsHelper.localTunnelOptions(options, true));

    const sslOpts = {
        cert: fs.readFileSync(options.cert).toString(),
        key: fs.readFileSync(options.key).toString(),
    };

    const httpsServer = https.createServer(sslOpts);

    httpsServer.on('request', (req, res) => {
        if (options.secret && req.url === '/?new') {
            const auth = req.headers.authorization || '';
            if (auth === '') {
                debug('Rejecting new tunnel without secret: secret required.');
                res.writeHead(401);
                res.write('No authorization\n');
                return;
            }

            const pieces = auth.split(' ');

            if (pieces.length !== 2) {
                debug('Rejecting new tunnel without secret: invalid authentication header format.');
                res.writeHead(401);
                res.write('No authorization\n');
                return;
            }

            if (pieces[0] !== 'Basic') {
                debug('Rejecting new tunnel without secret: invalid authentication type.');
                res.writeHead(401);
                res.write('No authorization\n');
                return;
            }

            const authData = pieces[1];

            const decoded = new Buffer.from(authData, 'base64').toString('ascii');

            const authPieces = decoded.split(':');

            if (authPieces[1] !== options.secret) {
                debug('Rejecting new tunnel without secret: invalid authentication secret.');
                res.writeHead(401);
                res.write('No authorization\n');
                return;
            }
        }
        ltServer.emit('request', req, res);
    });

    httpsServer.on('upgrade', (req, socket, head) => {
        ltServer.emit('upgrade', req, socket, head);
    });

    return httpsServer;
};