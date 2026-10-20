// ==========================================
// MEMORY CARD GAME
// Part 1
// ==========================================

// ---------------------------
// Card Data
// ---------------------------

let cardsArray = [
    "🐶", "🐶",
    "🐱", "🐱",
    "⭐", "⭐",
    "🍎", "🍎",
    "🚗", "🚗",
    "⚽", "⚽",
    "🌙", "🌙",
    "🐟", "🐟"
];

// ---------------------------
// HTML Elements
// ---------------------------

const gameBoard = document.getElementById("gameBoard");

const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");

const currentPlayer = document.getElementById("currentPlayer");

const restartBtn = document.getElementById("restartBtn");
const playAgain = document.getElementById("playAgain");

const popup = document.getElementById("popup");
const winnerText = document.getElementById("winnerText");

const timer = document.getElementById("timer");

const player1Box = document.querySelector(".player1");
const player2Box = document.querySelector(".player2");

const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

// Start Screen

const startScreen = document.getElementById("startScreen");
const startGameBtn = document.getElementById("startGameBtn");

const player1Input = document.getElementById("player1Input");
const player2Input = document.getElementById("player2Input");

const player1Name = document.getElementById("player1Name");
const player2Name = document.getElementById("player2Name");

// ---------------------------
// Variables
// ---------------------------

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let playerTurn = 1;

let playerOne = "Player 1";
let playerTwo = "Player 2";

let player1Score = 0;
let player2Score = 0;

let matchedPairs = 0;

// Timer

let seconds = 0;
let minutes = 0;
let timerInterval;

// ---------------------------
// Shuffle Cards
// ---------------------------

function shuffleCards() {

    cardsArray.sort(() => Math.random() - 0.5);

}

// ---------------------------
// Create Board
// ---------------------------

function createBoard() {

    gameBoard.innerHTML = "";

    shuffleCards();

    cardsArray.forEach(cardValue => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.card = cardValue;

        card.innerHTML = `

        <div class="card-inner">

            <div class="card-front">

                ?

            </div>

            <div class="card-back">

                ${cardValue}

            </div>

        </div>

        `;

        card.addEventListener("click", flipCard);

        gameBoard.appendChild(card);

    });

}

// ---------------------------
// Flip Card
// ---------------------------

function flipCard() {

    if (lockBoard)
        return;

    if (this === firstCard)
        return;

    if (this.classList.contains("matched"))
        return;

    this.classList.add("flip");

    if (!firstCard) {

        firstCard = this;

        return;

    }

    secondCard = this;

    lockBoard = true;

    checkMatch();

}

// ---------------------------
// Check Match
// ---------------------------

function checkMatch() {

    if (firstCard.dataset.card === secondCard.dataset.card) {

        matchCards();

    }

    else {

        unflipCards();

    }

}

// ==========================================
// MATCH FOUND
// ==========================================

function matchCards() {

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    matchedPairs++;

    if (playerTurn === 1) {

        player1Score++;
        score1.textContent = player1Score;

    }
    else {

        player2Score++;
        score2.textContent = player2Score;

    }

    resetCards();

    checkWinner();

}

// ==========================================
// WRONG MATCH
// ==========================================

function unflipCards() {

    setTimeout(() => {

        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        changePlayer();

        resetCards();

    }, 1000);

}

// ==========================================
// RESET CARDS
// ==========================================

function resetCards() {

    firstCard = null;
    secondCard = null;

    lockBoard = false;

}

// ==========================================
// CHANGE PLAYER
// ==========================================

function changePlayer() {

    if (playerTurn === 1) {

        playerTurn = 2;

    }
    else {

        playerTurn = 1;

    }

    updatePlayerUI();

}

// ==========================================
// UPDATE PLAYER UI
// ==========================================

function updatePlayerUI() {

    if (playerTurn === 1) {

        currentPlayer.textContent = playerOne;

        player1Box.classList.add("active-player");
        player2Box.classList.remove("active-player");

    }
    else {

        currentPlayer.textContent = playerTwo;

        player2Box.classList.add("active-player");
        player1Box.classList.remove("active-player");

    }

}

// ==========================================
// TIMER
// ==========================================

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        seconds++;

        if (seconds === 60) {

            seconds = 0;
            minutes++;

        }

        const m = minutes < 10 ? "0" + minutes : minutes;
        const s = seconds < 10 ? "0" + seconds : seconds;

        timer.textContent = `${m}:${s}`;

    }, 1000);

}

function resetTimer() {

    clearInterval(timerInterval);

    seconds = 0;
    minutes = 0;

    timer.textContent = "00:00";

}

// ==========================================
// MUSIC
// ==========================================

musicBtn.addEventListener("click", () => {

    if (bgMusic.paused) {

        bgMusic.play();

        musicBtn.textContent = "🔊 Music ON";

    }
    else {

        bgMusic.pause();

        musicBtn.textContent = "🔇 Music OFF";

    }

});

// Start music after first user interaction
document.addEventListener("click", () => {

    bgMusic.volume = 0.3;

    bgMusic.play().catch(() => { });

}, { once: true });

// ==========================================
// START GAME
// ==========================================

startGameBtn.addEventListener("click", () => {

    playerOne = player1Input.value.trim();

    playerTwo = player2Input.value.trim();

    if (playerOne === "") {

        playerOne = "Player 1";

    }

    if (playerTwo === "") {

        playerTwo = "Player 2";

    }

    player1Name.textContent = "👦 " + playerOne;
    player2Name.textContent = "👧 " + playerTwo;

    currentPlayer.textContent = playerOne;

    startScreen.style.display = "none";

    createBoard();

    startTimer();

    updatePlayerUI();

});

// ==========================================
// CHECK WINNER
// ==========================================

function checkWinner() {

    if (matchedPairs !== cardsArray.length / 2)
        return;

    clearInterval(timerInterval);

    let message = "";

    if (player1Score > player2Score) {

        message = `🏆 ${playerOne} Wins!`;

    }

    else if (player2Score > player1Score) {

        message = `🏆 ${playerTwo} Wins!`;

    }

    else {

        message = "🤝 It's a Draw!";

    }

    winnerText.innerHTML = `
        ${message}
        <br><br>
        ⏱️ Time: ${timer.textContent}
        <br><br>
        ${playerOne}: ${player1Score} Points
        <br>
        ${playerTwo}: ${player2Score} Points
    `;

    popup.classList.add("show");

    launchConfetti();

}

// ==========================================
// RESTART GAME
// ==========================================

function restartGame() {

    // Reset Variables

    playerTurn = 1;

    player1Score = 0;
    player2Score = 0;

    matchedPairs = 0;

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    // Reset Scores

    score1.textContent = "0";
    score2.textContent = "0";

    // Reset Timer

    resetTimer();

    // Hide Popup

    popup.classList.remove("show");

    // Update Current Player

    updatePlayerUI();

    // Create New Game

    createBoard();

    startTimer();

}

// ==========================================
// BUTTON EVENTS
// ==========================================

restartBtn.addEventListener("click", restartGame);

playAgain.addEventListener("click", restartGame);

// ==========================================
// CONFETTI
// ==========================================

const canvas = document.getElementById("confetti");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});

function launchConfetti() {

    const pieces = [];

    for (let i = 0; i < 250; i++) {

        pieces.push({

            x: Math.random() * canvas.width,

            y: -20,

            size: Math.random() * 8 + 4,

            speedY: Math.random() * 5 + 3,

            speedX: Math.random() * 6 - 3,

            rotation: Math.random() * 360,

            color: `hsl(${Math.random() * 360},100%,60%)`

        });

    }

    let frame = 0;

    function animate() {

        frame++;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(piece => {

            piece.y += piece.speedY;

            piece.x += piece.speedX;

            piece.rotation += 5;

            ctx.save();

            ctx.translate(piece.x, piece.y);

            ctx.rotate(piece.rotation * Math.PI / 180);

            ctx.fillStyle = piece.color;

            ctx.fillRect(
                -piece.size / 2,
                -piece.size / 2,
                piece.size,
                piece.size
            );

            ctx.restore();

        });

        if (frame < 220) {

            requestAnimationFrame(animate);

        } else {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

        }

    }

    animate();

}

// ==========================================
// OPTIONAL SOUND EFFECTS
// ==========================================

const flipSound = new Audio("flip.mp3");
const winSound = new Audio("win.mp3");

// Play flip sound when clicking a card

gameBoard.addEventListener("click", (event) => {

    if (event.target.closest(".card")) {

        flipSound.currentTime = 0;

        flipSound.play().catch(() => {});

    }

});

// Play win sound when popup opens

const originalLaunchConfetti = launchConfetti;

launchConfetti = function () {

    winSound.play().catch(() => {});

    originalLaunchConfetti();

};

// ==========================================
// STARTUP
// ==========================================

// Wait until players press "Start Game"
// The game board is created only after
// the start screen is completed.

console.log("Memory Cards Game Loaded Successfully!");