/*
 * Main Gameboard Constructor and maintainer
 */
const Gameboard = (() => {
    const board = new Array(9).fill("");
    const getBoard = () => board;
    const reset = () => board.fill("");
    const setBoard = (index, symbol) => (board[index] = symbol);
    const isSpaceAvailable = () => board.includes("");

    return {
        getBoard,
        reset,
        setBoard,
        isSpaceAvailable,
    };
})();

/*
 * Player object constructor
 */
const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return {
        getName,
        getSymbol,
    };
};

/*
 * Main Gameflow
 */
const Game = (() => {
    const Player1 = Player("Amit", "x");
    const Computer = Player("Computer", "o");
    let isGameOver = false;
    let currentPlayer = Player1;
    const board = Gameboard.getBoard();

    // DOM elements
    const squares = document.querySelectorAll(".game_board > div");
    const resetBTN = document.querySelector(".resetBTN");
    const displayWinner = document.querySelector(".announcement");
    const playAgainBTN = document.querySelector(".announcement > a");
    const winnerDeclaration = document.querySelector(".winner");
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
                isGameOver = true;
                winnerDeclaration.textContent = `${winnerName} has been won`;
                displayWinner.classList.add("visible");
                return true;
            }
        }
        // Checking for TIE
        if (!isGameOver && !board.includes("")) {
            winnerDeclaration.textContent = `TIE`;
            displayWinner.classList.add("visible");
        } else {
            return false;
        }
    };

    // After each payer's move wsitcging the player
    const switchPlayer = () => {
        currentPlayer = currentPlayer === Player1 ? Computer : Player1;
    };

    // On click of reset & playAgain btn resetting the display and Gameboard
    const resetGame = () => {
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
    resetBTN.addEventListener("click", resetGame);
    playAgainBTN.addEventListener("click", resetGame);

    squares.forEach((square) => {
        square.addEventListener("click", () => {
            const squareIndex = Array.from(squares).indexOf(square);
            if (Gameboard.getBoard()[squareIndex] === "") {
                Gameboard.setBoard(squareIndex, Player1.getSymbol());
                displaySymbol(square, xSymbol);
                checkWinner(Player1.getName());
                switchPlayer();
                if (!isGameOver && board.includes("")) {
                    computerMove();
                }
            }
        });
    });

    // Generating a random number from available spaces of gameboard for computer's move
    const randomIndex_Generator = () => {
        const emptyIndices = board.reduce((acc, val, index) => {
            if (val === "") {
                acc.push(index);
            }
            return acc;
        }, []);
        const randomIndex =
            emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        return randomIndex;
    };

    // Computer's move
    const computerMove = () => {
        const randomIndex = randomIndex_Generator();
        const displaySquare = Array.from(squares)[randomIndex];
        Gameboard.setBoard(randomIndex, Computer.getSymbol());
        displaySymbol(displaySquare, oSymbol);
        checkWinner(Computer.getName());
        switchPlayer();
    };
})();
