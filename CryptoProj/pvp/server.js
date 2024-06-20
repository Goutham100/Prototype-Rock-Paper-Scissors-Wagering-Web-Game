const io = require('socket.io')(3000)
let users = {}
let choices = {}
io.on('connection', socket => {
    socket.on('new-user', name => {
        if (Object.keys(users).length < 2) {
            users[socket.id] = name
            socket.emit('assign-id', socket.id)                    //when users connect they print the names
            socket.broadcast.emit('user-connected', name)
        }
    })

    socket.on('start-game', playerchoice => {
        choices[socket.id] = playerchoice

        if (Object.keys(choices).length === 2) {
            const user_ids = Object.keys(choices)              // starts the game , send the infos to the determinewinner function
                                                                         //   and gives back the results to the local script
            const player1Choice = choices[user_ids[0]]
            const player2Choice = choices[user_ids[1]]

            const result = determineWinner(player1Choice, player2Choice, user_ids)
            io.emit('game-result', result)

                                                        // Reset choices for the next round
            choices = {}
        }
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]                                                      //self-explanatory
        delete choices[socket.id]
    })
})

function determineWinner(player1Choice, player2Choice, user_ids) {
    if (player1Choice === player2Choice) {
        return { winner: null, player1Choice, player2Choice,players: user_ids };
    } else if (
        (player1Choice === 'rock' && player2Choice === 'scissors') ||                               //determines the winner
        (player1Choice === 'scissors' && player2Choice === 'paper') ||
        (player1Choice === 'paper' && player2Choice === 'rock')
    ) {
        return { winner: user_ids[0], player1Choice, player2Choice, players: user_ids };
    } else {
        return { winner: user_ids[1], player1Choice, player2Choice, players: user_ids };
    }
}

