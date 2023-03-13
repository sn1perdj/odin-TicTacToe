/*
 * Main Gameboard Constructor and maintainer
 */
const Gameboard = (() => {
    const board = new Array(9).fill("");
    const getBoard = () => board;
    const reset = () => board.fill("");
    const setBoard = (index, symbol) => (board[index] = symbol);
    const isSpaceAvailable = () => board.includes("");
    const resetSquare = (index) => (board[index] = "");

    return {
        getBoard,
        reset,
        setBoard,
        isSpaceAvailable,
        resetSquare,
    };
})();

/*
 * Player object constructor
 */
const Player = (name, symbol, score) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    const getScore = () => score;
    return {
        getName,
        getSymbol,
        score,
    };
};

/*
 * Main Gameflow
 */
const Game = (() => {
    const Player1 = Player("Amit", "x", 0);
    const Computer = Player("Computer", "o", 0);
    let isGameOver = false;
    let currentPlayer = Player1;
    const board = Gameboard.getBoard();

    // DOM elements
    const squares = document.querySelectorAll(".game_board > div");
    const resetBTN = document.querySelector(".resetBTN");
    const displayWinner = document.querySelector(".announcement");
    const playAgainBTN = document.querySelector(".announcement > a");
    const winnerDeclaration = document.querySelector(".winner");
    const player_score = document.querySelector(".player_score");
    const pc_score = document.querySelector(".pc_score");
    const xSymbol = "./assets/x.png";
    const oSymbol = "./assets/o.png";

    // Checking for game winner
    const checkWinner = (winnerName) => {
        const winner = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < winner.length; i++) {
            const [a, b, c] = winner[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    };

    // After each payer's move wsitcging the player
    const switchPlayer = () => {
        currentPlayer = currentPlayer === Player1 ? Computer : Player1;
    };

    // On click of reset & playAgain btn resetting the display and Gameboard
    const resetGameState = () => {
        Gameboard.reset();
        isGameOver = false;
        displayWinner.classList.remove("visible");
        winnerDeclaration.textContent = "";
        squares.forEach((square) => {
            const img = document.querySelector("img");
            if (img) {
                img.remove();
            }
        });
    };

    // Displaying the ongoing Game on Webpage
    const displaySymbol = (square, symbol) => {
        const img = document.createElement("img");
        img.src = symbol;
        square.appendChild(img);
    };

    // Handing the Webpage clicks
    resetBTN.addEventListener("click", () => {
        resetGameState();
        Player1.score = 0;
        Computer.score = 0;
        player_score.textContent = 0;
        pc_score.textContent = 0;
    });
    playAgainBTN.addEventListener("click", resetGameState);

    squares.forEach((square) => {
        square.addEventListener("click", () => {
            const squareIndex = Array.from(squares).indexOf(square);
            if (Gameboard.getBoard()[squareIndex] === "") {
                Gameboard.setBoard(squareIndex, Player1.getSymbol());
                displaySymbol(square, xSymbol);
                if (checkWinner()) {
                    Player1.score++;
                    winnerDeclaration.textContent = `${Player1.getName()} has been won`;
                    displayWinner.classList.add("visible");
                    player_score.textContent = Player1.score;
                    isGameOver = true;
                } else if (!isGameOver && !board.includes("")) {
                    winnerDeclaration.textContent = `TIE`;
                    displayWinner.classList.add("visible");
                } else {
                    switchPlayer();
                    if (!isGameOver && board.includes("")) {
                        computerMove();
                    }
                }
            }
        });
    });

    // to get all the available spaces inside the board
    const getAvailableMoves = () => {
        const emptyIndices = board.reduce((acc, val, index) => {
            if (val === "") {
                acc.push(index);
            }
            return acc;
        }, []);
        return emptyIndices;
    };

    // Computer's move
    const computerMove = () => {
        const availableMoves = getAvailableMoves();
        let bestMove;
        let bestScore = -Infinity;

        for (let i = 0; i < availableMoves.length; i++) {
            const move = availableMoves[i];
            Gameboard.setBoard(move, Computer.getSymbol());
            const score = minimax(Gameboard.getBoard(), false);
            Gameboard.resetSquare(move);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        Gameboard.setBoard(bestMove, Computer.getSymbol());
        const displaySquare = Array.from(squares)[bestMove];
        displaySymbol(displaySquare, oSymbol);

        if (checkWinner()) {
            Computer.score++;
            winnerDeclaration.textContent = `${Computer.getName()} has been won`;
            displayWinner.classList.add("visible");
            pc_score.textContent = Computer.score;
        } else if (!checkWinner()) {
            switchPlayer();
        }
    };

    // Applied the minimax algorithm
    const minimax = (board, depth, isMaximizing) => {
        if (checkWinner()) {
            if (currentPlayer === Computer) {
                return 10 - depth;
            } else {
                return depth - 10;
            }
        } else if (!board.includes("")) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = Computer.getSymbol();
                    const score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = Player1.getSymbol();
                    const score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };
})();
