const io = require('socket.io')(3000);
let users = {};
let choices = {};
let roomUsers = {};

io.on('connection', socket => {
    // Joining a room
    socket.on('join-room', (roomId, name) => {
        let temproom = io.sockets.adapter.rooms[roomId];

        if (!temproom) {
            socket.join(roomId);
            users[socket.id] = { name, roomId };
            socket.emit('assign-id', socket.id);
            socket.to(roomId).emit('user-connected', name);
            roomUsers[roomId] = [socket.id];
            socket.emit('roomusers', roomUsers[roomId]);
            console.log(`users: ${JSON.stringify(users)}`);
        } else {
            let temp_roomUsers = Object.keys(temproom.sockets);
            if (temp_roomUsers.length < 2) {
                socket.join(roomId);
                users[socket.id] = { name, roomId };
                socket.emit('assign-id', socket.id);
                socket.to(roomId).emit('user-connected', name);
                roomUsers[roomId].push(socket.id);
                socket.emit('roomusers', roomUsers[roomId]);
                console.log(`users: ${JSON.stringify(users)}`);

                // Start game if two users are present
                if (roomUsers[roomId].length === 2) {
                    io.to(roomId).emit('start-round');
                }
            } else {
                console.log(`${name} could not be joined`);
            }
        }
    });

    // Start the game
    socket.on('start-game', (roomId, playerChoice) => {
        if (!choices[roomId]) {
            choices[roomId] = {};
        }
        choices[roomId][socket.id] = playerChoice;
        console.log(choices);
        const room = io.sockets.adapter.rooms[roomId];
        roomUsers[roomId] = Object.keys(room.sockets);
        console.log(`roomusers: ${roomUsers[roomId]}`);

        if (roomUsers[roomId].length === 2 && Object.keys(choices[roomId]).length === 2) {
            const result = determineWinner(choices[roomId][roomUsers[roomId][0]], choices[roomId][roomUsers[roomId][1]], roomUsers[roomId]);
            io.to(roomId).emit('game-result', result);

            // Reset choices for the next round
            choices[roomId] = {};

            // Clear roomUsers after the match
            roomUsers[roomId] = [];
        }
    });

    // Disconnect event
    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            const roomId = user.roomId;
            socket.to(roomId).emit('user-disconnected', user.name);
            delete users[socket.id];
            if (choices[roomId]) {
                delete choices[roomId][socket.id];
            }
            if (roomUsers[roomId]) {
                roomUsers[roomId] = roomUsers[roomId].filter(id => id !== socket.id);
            }
        }
    });
});

function determineWinner(player1Choice, player2Choice, user_ids) {
    if (player1Choice === player2Choice) {
        return { winner: null, player1Choice, player2Choice, players: user_ids };
    } else if (
        (player1Choice === 'rock' && player2Choice === 'scissors') ||
        (player1Choice === 'scissors' && player2Choice === 'paper') ||
        (player1Choice === 'paper' && player2Choice === 'rock')
    ) {
        return { winner: user_ids[0], player1Choice, player2Choice, players: user_ids };
    } else {
        return { winner: user_ids[1], player1Choice, player2Choice, players: user_ids };
    }
}
