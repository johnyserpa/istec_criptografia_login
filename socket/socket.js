
function socket(io) {

    let connections = 0;
    
    io.on('connection', (socket) => {
        connections = io.engine.clientsCount;

        const auth = require('../controllers/auth')(socket);

        console.log("User connected... " + connections + " connections.")
        
        socket.emit('handshake', 'Connection established...');

        socket.on('message', (msg) => {
            console.log("Message received: " + msg);
            socket.emit('message', 'Got mail...');
        });

        socket.on('login', auth.login)

    })

    io.on('disconnect', () => {
        console.log("User disconnected... " + connections + " connections.")
    })
}

module.exports = socket;