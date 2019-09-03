#!/bin/bash
#
#	/etc/rc.d/init.d/ltssd
#
#
# <tags -- see below for tag definitions.  *Every line* from the top
#  of the file to the end of the tags section must begin with a #
#  character.  After the tags section, there should be a blank line.
#  This keeps normal comments in the rest of the file from being
#  mistaken for tags, should they happen to fit the pattern.>

# Source function library.
. /etc/init.d/functions
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

LTSS_BIN=/root/.nvm/versions/node/v10.16.3/bin/ltss
FOREVER_BIN=/root/.nvm/versions/node/v10.16.3/bin/forever
LTSS_DOMAIN=lt.<your domain>
LTSS_ADDRESS=<public ip>
LTSS_PORT=443
LTSS_SECRET=<your secret>>
LTSS_SOCKETS=40
LTSS_TLS_CERT=/etc/letsencrypt/live/<your domain>/fullchain.pem
LTSS_TLS_KEY=/etc/letsencrypt/live/<your domain>/privkey.pem

if [ ! -d /var/ltss ]
then
	mkdir /var/ltss
fi

start() {
	echo -n "Starting ltssd: "
	$FOREVER_BIN start -p /var/ltss $LTSS_BIN \
		--address $LTSS_ADDRESS \
		--port $LTSS_PORT \
		--domain $LTSS_DOMAIN \
		--cert $LTSS_TLS_CERT \
		--key $LTSS_TLS_KEY \
		--secret $LTSS_SECRET \
		--sockets $LTSS_SOCKETS \
		--secure
	RESULT=$?
	touch /var/lock/subsys/ltssd
	return $RESULT
}

stop() {
	echo -n "Shutting down ltssd: "
        $FOREVER_BIN stop -p /var/ltss $LTSS_BIN
	RESULT=$?
	rm -f /var/lock/subsys/ltssd
	return $RESULT
}

case "$1" in
    start)
	start
	;;
    stop)
	stop
	;;
    restart)
    	stop
	start
	;;
    *)
	echo "Usage: ltssd {start|stop|restart}"
	exit 1
	;;
esac
exit $?
