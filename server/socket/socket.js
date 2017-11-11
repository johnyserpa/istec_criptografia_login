function socket(io) {

    io.on('connection', (socket) => {

        console.log('User connected...');

        socket.emit('handshake', 'Connection established...');

        socket.on('message', (msg) => {
            console.log("Message received: " + msg);
            socket.emit('message', 'Got mail...');
        });

    })
}

module.exports = socket;