module.exports = {
    localTunnelOptions: (opts, secure) => {
        return {
            'max-sockets': opts.sockets,
            secure: secure || false,
            domain: opts.domain,
        };
    },
};