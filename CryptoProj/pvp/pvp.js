const socket = io('http://localhost:3000')
const choices = ['rock', 'paper', 'scissors']
const playerdisplay = document.getElementById('playerdisplay')
const opponentdisplay = document.getElementById('opponentdisplay')
const resultdisplay = document.getElementById('resultdisplay')
const playerscore = document.getElementById('playerscore')
const oppscore = document.getElementById('oppscore')
const messageContainer = document.getElementById('players')

let player_points = 0
let opp_points = 0
let player_id;
const name = prompt('Enter your name')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
})

socket.on('assign-id', id => {
    player_id = id
})

socket.on('game-result', result => {
    if (result.winner === null) {
        resultdisplay.textContent = "It's a tie"
    } else if (result.winner === player_id) {
        resultdisplay.textContent = "Round won"
        player_points++
    } else {
        resultdisplay.textContent = "Round lost"
        opp_points++
    }
    if (player_id === result.players[0])
    {
        playerdisplay.textContent = `Player: ${result.player1Choice}`
        opponentdisplay.textContent = `Opponent: ${result.player2Choice}`
    }
    else if (player_id === result.players[1])
    {
        playerdisplay.textContent = `Player: ${result.player2Choice}`
        opponentdisplay.textContent = `Opponent: ${result.player1Choice}`
    }

    playerscore.textContent = `Player: ${player_points}`
    oppscore.textContent = `Opponent: ${opp_points}`

    if (player_points >= 3 || opp_points >= 3) {
        resultdisplay.textContent = player_points > opp_points ? 'You Won' : 'Opponent Won'

    }
})

function appendMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement)
}

function playgame(playerchoice) {
    socket.emit('start-game', playerchoice)
}

function reloadPage() {
    location.reload()
}


