# LocalTunnel Secure Server

An augmentation of the [LocalTunnel Server](https://github.com/localtunnel/server) that adds SSL and basic authentication to LocalTunnel.

## Installation

```bash
npm install localtunnel-secure-server -g
```

## Usage

```bash
$ ltss --help
Usage:
  cli.js [OPTIONS] [ARGS]

Options: 
  -a, --address [STRING] Address to bind to (e.g. localhost, 127.0.0.1)  (Default is 127.0.0.1)
  -p, --port [NUMBER]    Port to bind to (Default is 4443)
  -d, --domain [STRING]  Domain to use as the root for tunnels (Default is localtest.me)
      --cert [FILE]      SSL Certificate to use (Default is cert/server-cert.pem)
  -k, --key [FILE]       SSL Private Key to use (Default is cert/server-key.pem)
  -s, --secret STRING    Secret to require
  -S, --secure [BOOL]    Run with ssl (Default is true)
  -m, --sockets [NUMBER] Max sockets (Default is 10)
  -h, --help             Display help and usage details
```

## Example Implementation

### CLI
```bash
$ ./cli.js --secure --secret foo 
server listening on: https://127.0.0.1:4443
```

### Code

```javascript
require = require("esm")(module/*, options*/);
const serverBuilder = require('../lib/server').default;

const options = {
    address: '127.0.0.1',
    port: '4443',
    domain: 'localtest.me',
    cert: __dirname + '/../cert/server-cert.pem',
    key: __dirname + '/../cert/server-key.pem',
    secret: 'foo',
    secure: true,
    sockets: 20,
};

const server = serverBuilder(options);

server.listen(options.port, options.address, () => {
    const protocol = (options.secure) ? 'https' : 'http';
    console.log(`server listening at ${protocol}://${server.address().address}:${server.address().port}`);
});
```

## Example Usage

```javascript
const localtunnel = require('localtunnel');
const tunnel = localtunnel('8080', { local_host: '127.0.0.1', host: 'https://:foo@localtest.me:4443' }, (err, tun) => {
    if (err) {
        console.error("Got an error opening the tunnel", err);
        return;
    }

    console.log(`Listening at ${tun.url}`);
});
```