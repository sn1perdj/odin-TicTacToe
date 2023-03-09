const board = [null, null, null, null, null, null, null, null, null];

// Game Rules
function checkWinner(board, symbol) {
    // checking Horizonal
    if (board[0] === symbol && board[1] === symbol && board[2] === symbol) {
        return true;
    } else if (
        board[3] === symbol &&
        board[4] === symbol &&
        board[5] === symbol
    ) {
        return true;
    } else if (
        board[6] === symbol &&
        board[7] === symbol &&
        board[8] === symbol
    ) {
        return true;
    }

    // checking Vertical
    if (board[0] === symbol && board[3] === symbol && board[6] === symbol) {
        return true;
    } else if (
        board[1] === symbol &&
        board[4] === symbol &&
        board[7] === symbol
    ) {
        return true;
    } else if (
        board[2] === symbol &&
        board[6] === symbol &&
        board[8] === symbol
    ) {
        return true;
    }

    // checking diagonal
    if (board[0] === symbol && board[4] === symbol && board[8] === symbol) {
        return true;
    } else if (
        board[2] === symbol &&
        board[4] === symbol &&
        board[6] === symbol
    ) {
        return true;
    }
}

// give random number
function generateRandomEmptyIndex() {
    const emptyIndices = board.reduce((acc, val, index) => {
        if (val === null) {
            acc.push(index);
        }
        return acc;
    }, []);

    if (emptyIndices.length === 0) {
        return "There are no empty places in the board";
    }

    const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    return randomIndex;
}

//
// All divs selector
const announcement = document.querySelector(".announcement");
const winner = document.querySelector(".winner");
const board_block = document.querySelectorAll(".game_board > div");
board_block.forEach((div) => {
    div.addEventListener("click", () => {
        if (div.innerHTML === "") {
            // Player move
            const img = document.createElement("img");
            img.src = "./assets/x.png";
            div.appendChild(img);
            const index = Array.from(board_block).indexOf(div);
            board[index] = "x";
            const player_status = checkWinner(board, "x");
            if (player_status === true) {
                announcement.classList.add("visible");
                winner.textContent = "Player has been won";
            }

            // Computer move
            const comp_selection = generateRandomEmptyIndex();
            if (typeof comp_selection === "string") {
                winner.textContent = "TIE";
            } else {
                const comp_img = document.createElement("img");
                comp_img.src = "./assets/o.png";
                board_block[comp_selection].append(comp_img);
                board[comp_selection] = "o";
                const comp_status = checkWinner(board, "o");
                // console.log(comp_status);
                if (comp_status === true) {
                    announcement.classList.add("visible");
                    winner.textContent = "Computer has been won";
                }
            }
        }
    });
});

// button to reset the board and refresh the page
function resetPage() {
    window.location.reload();
}

const reset = document.querySelector(".resetBTN");
const playAgain = document.querySelector(".announcement > a");
reset.addEventListener("click", resetPage);
playAgain.addEventListener("click", resetPage);
