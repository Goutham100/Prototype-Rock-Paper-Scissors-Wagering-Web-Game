const socket = io("http://localhost:3000");
const choices = [
    "rock",
    "paper",
    "scissors"
];
const playerdisplay = document.getElementById("playerdisplay");
const opponentdisplay = document.getElementById("opponentdisplay");
const resultdisplay = document.getElementById("resultdisplay");
const playerscore = document.getElementById("playerscore");
const oppscore = document.getElementById("oppscore");
const messageContainer = document.getElementById("players");
let player_points = 0;
let opp_points = 0;
let player_id;
const alphabets = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8"
];
const name = prompt("Enter your name");
let roomId = localStorage.getItem("room_id");
if (!roomId) {
    roomId = "";
    for(let i = 0; i < 5; i++){
        let num = Math.floor(Math.random() * alphabets.length);
        roomId += alphabets[num];
    }
    console.log("Generated new room_id:", roomId); // Debugging log
}
appendMessage(`Room-Id: ${roomId}`);
appendMessage("You joined");
socket.emit("join-room", roomId, name);
socket.on("user-connected", (name)=>{
    appendMessage(`${name} connected`);
});
socket.on("assign-id", (id)=>{
    player_id = id;
});
function playgame(playerchoice) {
    console.log(playerchoice);
    socket.emit("start-game", roomId, playerchoice);
}
socket.on("game-result", (result)=>{
    if (result.winner === null) resultdisplay.textContent = "It's a tie";
    else if (result.winner === player_id) {
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
    if (player_points >= 3 || opp_points >= 3) resultdisplay.textContent = player_points > opp_points ? "You Won" : "Opponent Won";
});
function appendMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}
function reloadPage() {
    location.reload();
}

//# sourceMappingURL=pvp.8d0aa361.js.map
