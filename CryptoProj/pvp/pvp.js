const socket = io('http://localhost:3000');
let choices = ['rock', 'paper', 'scissors'];
const playerdisplay = document.getElementById('playerdisplay');
const opponentdisplay = document.getElementById('opponentdisplay');
const resultdisplay = document.getElementById('resultdisplay');
const playerscore = document.getElementById('playerscore');
const oppscore = document.getElementById('oppscore');
const messageContainer = document.getElementById('players');
const roundDisplay = document.getElementById('roundDisplay');  // Add this line
const timerDisplay = document.getElementById('timerDisplay');  // Add this line

let player_points = 0;
let opp_points = 0;
let player_id;
let roundNumber = 1;
let room_users = [];
let countdown;
const alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", '1', '2', '3', '4', '5', '6', '7', '8'];
const name = prompt('Enter your name');
let roomId = localStorage.getItem('room_id');

if (!roomId) {
    roomId = '';
    for (let i = 0; i < 5; i++) {
        let num = Math.floor(Math.random() * alphabets.length);
        roomId += alphabets[num];
    }
}

appendMessage(`Room-Id: ${roomId}`);
appendMessage('You joined');
socket.emit('join-room', roomId, name);

socket.on('user-connected', name => {
    appendMessage(`${name} connected`);
});

socket.on('assign-id', id => {
    player_id = id;
});

socket.on('roomusers', roomusers =>
{
    room_users = roomusers;
});

socket.on('start-round', () =>
{
        startRound();
});

function playgame(playerchoice)
{
    console.log(playerchoice);
    clearInterval(countdown);
    socket.emit('start-game', roomId, playerchoice);
}

socket.on('game-result', result => {
    if (result.winner === null) {
        resultdisplay.textContent = "It's a tie";
    } else if (result.winner === player_id) {
        resultdisplay.textContent = "Round won";
        player_points++;
    } else {
        resultdisplay.textContent = "Round lost";
        opp_points++;
    }
    if (player_id === result.players[0]) {
        playerdisplay.textContent = `Player: ${result.player1Choice}`;
        opponentdisplay.textContent = `Opponent: ${result.player2Choice}`;
    } else if (player_id === result.players[1]) {
        playerdisplay.textContent = `Player: ${result.player2Choice}`;
        opponentdisplay.textContent = `Opponent: ${result.player1Choice}`;
    }

    playerscore.textContent = `Player: ${player_points}`;
    oppscore.textContent = `Opponent: ${opp_points}`;

    if (player_points >= 3 || opp_points >= 3) {
        resultdisplay.textContent = player_points > opp_points ? 'You Won' : 'Opponent Won';
        room_users = [];
    } else {
        startRound();
    }
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}

function reloadPage() {
    location.reload();
}

function startRound() {  // Add this function
    roundDisplay.textContent = `Round: ${roundNumber}`;
    let timeLeft = 10;
    timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerDisplay.textContent = 'Time up!';
            let choice = choices[Math.floor(Math.random() * 3)];
            playgame(choice);
        }
    }, 1000);
    roundNumber++;
}
