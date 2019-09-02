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
