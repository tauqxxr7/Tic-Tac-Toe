document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("game-board");
    const gameOverMessage = document.getElementById("game-over-message");
    const restartButton = document.getElementById("restart-button");
    let currentPlayer = "X";  // Player X starts the game
    let gameOver = false;

    // Create the game board cell
    function createCell() {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", handleCellClick);
        return cell;
    }

    // Handle player's move when a cell is clicked
    function handleCellClick(event) {
        if (gameOver || event.target.textContent !== "" || currentPlayer !== "X") {
            return;
        }

        // Player X makes a move
        event.target.textContent = currentPlayer;

        if (checkWinner()) {
            gameOverMessage.textContent = `${currentPlayer} wins!`;
            gameOverMessage.style.display = "block";
            gameOver = true;
            animateWinner();
            restartButton.style.display = "block";
            return;
        } else {
            currentPlayer = "O";  // Switch to computer's turn
        }

        if (checkDraw()) {
            gameOverMessage.textContent = "It's a draw!";
            gameOverMessage.style.display = "block";
            gameOver = true;
            restartButton.style.display = "block";
        } else if (!gameOver) {
            setTimeout(computerMove, 500);  // Give a short delay before computer's move
        }
    }

    // Computer's move - it will make strategic choices, not random moves
    function computerMove() {
        const cells = document.querySelectorAll(".cell");
        let availableCells = [];

        cells.forEach((cell, index) => {
            if (cell.textContent === "") {
                availableCells.push(cell);
            }
        });

        // If there are empty cells, the computer will make a move
        if (availableCells.length > 0) {
            const bestMove = findBestMove(); // Find the best move for the computer
            bestMove.textContent = "O"; // Computer makes the move

            if (checkWinner()) {
                gameOverMessage.textContent = "O wins!";
                gameOverMessage.style.display = "block";
                gameOver = true;
                animateWinner();
                restartButton.style.display = "block";
            } else {
                currentPlayer = "X";  // Switch to player's turn
            }

            if (checkDraw() && !gameOver) {
                gameOverMessage.textContent = "It's a draw!";
                gameOverMessage.style.display = "block";
                gameOver = true;
                restartButton.style.display = "block";
            }
        }
    }

    // Function to check for a winner
    function checkWinner() {
        const cells = document.querySelectorAll(".cell");

        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combo of winCombinations) {
            const [a, b, c] = combo;
            if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[b].textContent === cells[c].textContent) {
                highlightWinner(cells[a], cells[b], cells[c]);
                return true;
            }
        }

        return false;
    }

    // Highlight the winning cells
    function highlightWinner(cellA, cellB, cellC) {
        cellA.style.backgroundColor = "#8bc34a";
        cellB.style.backgroundColor = "#8bc34a";
        cellC.style.backgroundColor = "#8bc34a";
    }

    // Animate the winning cells (scale up effect)
    function animateWinner() {
        const winningCells = document.querySelectorAll(".cell[style='background-color: #8bc34a;']");

        winningCells.forEach(cell => {
            cell.style.transition = "transform 0.5s ease-in-out";
            cell.style.transform = "scale(1.2)";
        });
    }

    // Check if the game is a draw (no empty cells left)
    function checkDraw() {
        const cells = document.querySelectorAll(".cell");
        for (const cell of cells) {
            if (cell.textContent === "") {
                return false;
            }
        }
        return true;
    }

    // Find the best move for the computer (blocking and winning strategy)
    function findBestMove() {
        const cells = document.querySelectorAll(".cell");

        // Try to win or block opponent's win
        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // Check if computer can win or block the opponent from winning
        for (const combo of winCombinations) {
            const [a, b, c] = combo;
            const combination = [cells[a], cells[b], cells[c]];

            // Check for a potential winning move
            if (combination.filter(cell => cell.textContent === "O").length === 2 && combination.some(cell => cell.textContent === "")) {
                return combination.find(cell => cell.textContent === "");
            }

            // Check if player is about to win and block it
            if (combination.filter(cell => cell.textContent === "X").length === 2 && combination.some(cell => cell.textContent === "")) {
                return combination.find(cell => cell.textContent === "");
            }
        }

        // If no immediate winning or blocking move, pick a random available cell
        const availableCells = Array.from(cells).filter(cell => cell.textContent === "");
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    // Restart the game when the player clicks "Play Again"
    restartButton.addEventListener("click", function () {
        location.reload();
    });

    // Create and append cells to the game board
    for (let i = 0; i < 9; i++) {
        board.appendChild(createCell());
    }
});
