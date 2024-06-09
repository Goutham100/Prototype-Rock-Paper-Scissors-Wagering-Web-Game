const choices = [
    "rock",
    "paper",
    "scissors"
];
const playerdisplay = document.getElementById("playerdisplay");
const compdisplay = document.getElementById("compdisplay");
const resultdisplay = document.getElementById("resultdisplay");
const playerscore = document.getElementById("playerscore");
const compscore = document.getElementById("compscore");
let player_points = 0;
let comp_points = 0;
function playgame(playerchoice) {
    if (player_points >= 3 || comp_points >= 3) {
        resultdisplay.textContent = player_points > comp_points ? "Player Won" : "Computer Won";
        return;
    }
    const compchoice = choices[Math.floor(Math.random() * 3)];
    if (playerchoice === compchoice) resultdisplay.textContent = "It's a tie";
    else switch(playerchoice){
        case "rock":
            if (compchoice === "paper") {
                resultdisplay.textContent = "Round lost";
                comp_points++;
            } else {
                resultdisplay.textContent = "Round won";
                player_points++;
            }
            break;
        case "paper":
            if (compchoice === "scissors") {
                resultdisplay.textContent = "Round lost";
                comp_points++;
            } else {
                resultdisplay.textContent = "Round won";
                player_points++;
            }
            break;
        case "scissors":
            if (compchoice === "rock") {
                resultdisplay.textContent = "Round lost";
                comp_points++;
            } else {
                resultdisplay.textContent = "Round won";
                player_points++;
            }
            break;
    }
    playerdisplay.textContent = `Player: ${playerchoice}`;
    compdisplay.textContent = `Computer: ${compchoice}`;
    playerscore.textContent = `Player: ${player_points}`;
    compscore.textContent = `Computer: ${comp_points}`;
    if (player_points >= 3 || comp_points >= 3) resultdisplay.textContent = player_points > comp_points ? "Player Won" : "Computer Won";
}
function reloadPage() {
    location.reload();
}

//# sourceMappingURL=againstai.dab3b204.js.map
