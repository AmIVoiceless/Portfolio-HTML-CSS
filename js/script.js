document.addEventListener("DOMContentLoaded", () => {

    const incrementButton = document.getElementById("incrementButton");
    const resetButton = document.getElementById("resetButton");
    const counterValue = document.getElementById("counterValue");

    if (incrementButton && resetButton && counterValue) {
        let count = parseInt(localStorage.getItem("counter")) || 0;
        counterValue.textContent = count;

        incrementButton.addEventListener("click", () => {
            count++;
            counterValue.textContent = count;
            localStorage.setItem("counter", count);
        });

        resetButton.addEventListener("click", () => {
            count = 0;
            counterValue.textContent = count;
            localStorage.setItem("counter", count);
        });
    }

    const generateAdventureButton = document.getElementById("generateAdventureButton");
    const adventureText = document.getElementById("adventureText");
    const adventureList = document.getElementById("adventureList");
    const clearAdventureButton = document.getElementById("clearAdventureButton");

    if (generateAdventureButton && adventureText && adventureList) {

        const characters = ["рыцарь", "маг", "вор", "охотник", "алхимик"];
        const locations = ["лес", "замок", "царство", "пустыня", "деревня"];
        const villains = ["дракон", "колдун", "гоблин", "ведьма", "тролль"];

        function getRandomItem(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function generateAdventure() {
            const adventure = `Ваш персонаж - ${getRandomItem(characters)} находится в ${getRandomItem(locations)} и сражается с ${getRandomItem(villains)}`;
            adventureText.textContent = adventure;

            let adventures = JSON.parse(localStorage.getItem("adventures")) || [];
            adventures.push(adventure);
            localStorage.setItem("adventures", JSON.stringify(adventures));
            renderAdventures();
        }

        function renderAdventures() {
            const adventures = JSON.parse(localStorage.getItem("adventures")) || [];
            adventureList.innerHTML = "";
            adventures.forEach(a => {
                const div = document.createElement("div");
                div.className = "adventure item";
                div.textContent = a;
                adventureList.appendChild(div);
            });
        }

        generateAdventureButton.addEventListener("click", generateAdventure);

        if (clearAdventureButton) {
            clearAdventureButton.addEventListener("click", () => {
                localStorage.removeItem("adventures");
                adventureList.innerHTML = "";
                adventureText.textContent = "";
            });
        }

        renderAdventures();
    }

    const guessInput = document.getElementById("guessInput");
    const submitGuessButton = document.getElementById("submitGuessButton");
    const guessFeedback = document.getElementById("guessFeedback");
    const restartGuessButton = document.getElementById("restartGuessButton");

    if (guessInput && submitGuessButton && guessFeedback && restartGuessButton) {
        let targetNumber = Math.floor(Math.random() * 100) + 1;

        submitGuessButton.addEventListener("click", () => {
            const guess = Number(guessInput.value);

            if (!guess || guess < 1 || guess > 100) {
                guessFeedback.textContent = "Введите число от 1 до 100";
                return;
            }

            if (guess === targetNumber) {
                guessFeedback.textContent = `Вы угадали число ${targetNumber}`;
            } else if (guess < targetNumber) {
                guessFeedback.textContent = "Больше";
            } else {
                guessFeedback.textContent = "Меньше";
            }
        });

        restartGuessButton.addEventListener("click", () => {
            targetNumber = Math.floor(Math.random() * 100) + 1;
            guessFeedback.textContent = "";
            guessInput.value = "";
        });
    }

    const reactionButton = document.getElementById("reactionButton");
    const reactionArea = document.getElementById("reactionArea");
    const reactionFeedback = document.getElementById("reactionFeedback");
    const reactionTimer = document.getElementById("reactionTimer");
    const reactionRestartButton = document.getElementById("reactionRestartButton");

    if (reactionButton && reactionArea && reactionFeedback && reactionTimer && reactionRestartButton) {

        let reactionTimeStart = 0;
        let reactionTimes = [];
        let reactionClicks = 0;
        let reactionInterval;
        let reactionCountdown = 30;

        function showReactionButton() {
            let maxX = reactionArea.clientWidth - reactionButton.offsetWidth;
            let maxY = reactionArea.clientHeight - reactionButton.offsetHeight;

            reactionButton.style.left = Math.floor(Math.random() * maxX) + "px";
            reactionButton.style.top = Math.floor(Math.random() * maxY) + "px";
            reactionButton.style.display = "block";
            reactionTimeStart = performance.now();
        }

        function hideReactionButton() {
            reactionButton.style.display = "none";
            let delay = Math.random() * 4000 + 1000;
            reactionInterval = setTimeout(showReactionButton, delay);
        }

        function startReactionGame() {
            reactionTimes = [];
            reactionClicks = 0;
            reactionCountdown = 30;
            reactionTimer.textContent = reactionCountdown;
            reactionFeedback.textContent = "";
            hideReactionButton();

            let countdownInterval = setInterval(() => {
                reactionCountdown--;
                reactionTimer.textContent = reactionCountdown;

                if (reactionCountdown <= 0) {
                    clearInterval(countdownInterval);
                    clearTimeout(reactionInterval);
                    reactionButton.style.display = "none";

                    let avg = reactionTimes.length
                        ? (reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length).toFixed(2)
                        : 0;

                    reactionFeedback.textContent =
                        `Успешные нажатия: ${reactionClicks}, среднее время реакции: ${avg} мс`;
                }
            }, 1000);
        }

        reactionButton.addEventListener("click", () => {
            let reactionTimeEnd = performance.now();
            reactionTimes.push(reactionTimeEnd - reactionTimeStart);
            reactionClicks++;
            reactionButton.style.display = "none";
            let delay = Math.random() * 4000 + 1000;
            reactionInterval = setTimeout(showReactionButton, delay);
        });

        reactionRestartButton.addEventListener("click", () => {
            clearTimeout(reactionInterval);
            startReactionGame();
        });

        startReactionGame();
    }

    const board = document.getElementById("board");
    const cells = document.querySelectorAll(".cell");
    const gameStatus = document.getElementById("gameStatus");
    const restartGame = document.getElementById("restartGame");
    
    if (board && cells.length && gameStatus && restartGame) {
    
        let currentPlayer = "X";
        let gameActive = true;
        let gameState = ["", "", "", "", "", "", "", "", ""];
    
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
    
        function checkWinner() {
            for (let condition of winConditions) {
                let [a, b, c] = condition;
                if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                    gameStatus.textContent = `Победил ${currentPlayer}`;
                    gameActive = false;
                    return;
                }
            }
        
            if (!gameState.includes("")) {
                gameStatus.textContent = "Ничья";
                gameActive = false;
            }
        }
    
        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => {
                if (gameState[index] !== "" || !gameActive) return;
            
                gameState[index] = currentPlayer;
                cell.textContent = currentPlayer;
            
                checkWinner();
            
                currentPlayer = currentPlayer === "X" ? "O" : "X";
            });
        });
    
        restartGame.addEventListener("click", () => {
            gameState = ["", "", "", "", "", "", "", "", ""];
            currentPlayer = "X";
            gameActive = true;
            gameStatus.textContent = "";
            cells.forEach(cell => cell.textContent = "");
        });
    }
});