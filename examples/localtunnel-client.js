process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const localtunnel = require('localtunnel');

const local = 'http://localtest.me:4443';
const localSecure = 'https://localtest.me:4443';
const localSecurePassword = 'https://:foo@localtest.me:4443';
const localSecureWrongPassword = 'https://:bar@localtest.me:4443';

const target = localSecurePassword;

const tunnel = localtunnel('8080', { local_host: '127.0.0.1', host: target }, (err, tun) => {
    if (err) {
        console.error("Got an error opening the tunnel", err);
        return;
    }

    console.log(`Listening at ${tun.url}`);
});