const TicTacToe = (function () {
    // new game board
    const board = new Array(9).fill(null);
    const xSymbol = "./assets/x.png";
    const oSymbol = "./assets/o.png";
    let currentPlayer = "x";
    let isGameOver = false;

    //selecting all the sqaures from game board
    const squares = document.querySelectorAll(".game_board > div");
    const announcement = document.querySelector(".announcement");
    const winnerText = document.querySelector(".announcement > p");

    // Main game function, initializer
    const init = () => {
        squares.forEach((square) => {
            square.addEventListener("click", () => {
                const squareIndex = Array.from(squares).indexOf(square);
                if (
                    !isGameOver &&
                    square.textContent === "" &&
                    board[squareIndex] === null
                ) {
                    board[squareIndex] = currentPlayer;
                    const img = document.createElement("img");
                    img.src = xSymbol;
                    square.appendChild(img);
                    winner();
                    switchPlayer();

                    if (!isGameOver) {
                        computerMove();
                    }
                }
            });
        });
    };

    // Computer's Move
    const computerMove = () => {
        const randomIndex = randomIndex_Generator();
        const displaySquare = Array.from(squares)[randomIndex];
        board[randomIndex] = currentPlayer;
        const img = document.createElement("img");
        img.src = oSymbol;
        displaySquare.appendChild(img);
        winner();
        switchPlayer();
    };

    // Generating a random number
    const randomIndex_Generator = () => {
        // generating a Array of empty places
        const emptyIndices = board.reduce((acc, val, index) => {
            if (val === null) {
                acc.push(index);
            }
            return acc;
        }, []);
        // selecting a random place from the array which is empty
        const randomIndex =
            emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        return randomIndex;
    };

    // Checking for the Winner
    const winner = () => {
        const winningVariations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // checking if any variations from above array matches.
        for (let i = 0; i < winningVariations.length; i++) {
            const [a, b, c] = winningVariations[i];
            // checking
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                isGameOver = true;
                announcement.classList.add("visible");
                winnerText.textContent = `${currentPlayer} has been WON`;
            }
        }
        // checking and declaring "TIE", if nobody managed to WIN
        if (!board.includes(null) && !isGameOver) {
            announcement.classList.add("visible");
            winnerText.textContent = `It is a TIE`;
        }
    };

    const switchPlayer = () => {
        if (currentPlayer === "x") {
            currentPlayer = "o";
        } else {
            currentPlayer = "x";
        }
    };

    // Making Virtual board null again, and all squares go blank again
    const reset = () => {
        board.fill(null);
        squares.forEach((square) => {
            const img = square.querySelector("img");
            if (img) {
                img.remove();
            }
        });
        currentPlayer = "x";
        isGameOver = false;
        announcement.classList.remove("visible");
    };

    return {
        init,
        reset,
    };
})();

// Game Initializer
TicTacToe.init();

// onBoard Reset Button
const resetBTN = document.querySelector(".resetBTN");
resetBTN.addEventListener("click", () => {
    TicTacToe.reset();
});

// Popup reply button
const replayBTN = document.querySelector(".announcement > a");
replayBTN.addEventListener("click", () => {
    TicTacToe.reset();
});
