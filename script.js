const cells = document.querySelectorAll('.cell');
const winDisplay = document.querySelector('.win-display');
const restartBtn = document.querySelector('#restart-btn');

const gameBoard = (function(){
    const board = [['', '', ''],
                   ['', '', ''],
                   ['', '', '']];

    let player = 'x';
    let takenCells = [];
    let winFlag = false;
    
    cells.forEach(cell => {
        cell.addEventListener('click', takeInput)
    });

    restartBtn.addEventListener('click', clear);

    function takeInput() {
        if (winFlag) {
            return;
        } else {
            const [row, column] = this.getAttribute('data').split('');
            if (board[+row][+column]) {
                return
            } else {
                takenCells.push(1);
                board[+row][+column] = player;
                checkWin();
                checkDraw();
            };
            // let bestMove = boardAI.findBestMove(board)
            // console.log(bestMove)
            player = player === 'x' ? 'o' : 'x';
            render();
        };
    };

    function checkDraw() {
        if (winFlag) {
            return;
        } else if (takenCells.length === 9) {
            winDisplay.textContent = 'DRAW';
        }
    };

    function displayWin() {
        winDisplay.textContent = `WINNER IS  ${player.toUpperCase()}`;
        winFlag = true;
    };

    function checkWin() {
        // row check
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                if (board[i][0] === 'x' || board[i][0] === 'o') {
                    displayWin()
                }
            }
        }
        // column check
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                if (board[0][i] === 'x' || board[0][i] === 'o') {
                    displayWin()
                }
            }
        }
        // diagnal check
        if (board[0][0] === 'x' && board[1][1] === 'x' && board[2][2] === 'x' ||
            board[0][2] === 'x' && board[1][1] === 'x' && board[2][0] === 'x' ||
            board[0][0] === 'o' && board[1][1] === 'o' && board[2][2] === 'o' ||
            board[0][2] === 'o' && board[1][1] === 'o' && board[2][0] === 'o') {
            displayWin();
        } ;
    };

    function render() {
        cells.forEach(cell => {
            const [row, column] = cell.getAttribute('data').split('');
            cell.textContent = board[+row][+column];
        });
    };

    function clear() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
              board[i][j] = '';
            };
        };
        player = 'x',
        takenCells = [];
        winFlag = false;
        winDisplay.textContent = '';
        render();
    };

    return { board, player, render, clear };
})();


const boardAI = (function(){

    let player = 'x', ai = 'o';

    function isMoveLeft(board) {
        for (let i = 0; i < 3; i++) 
            for(let j = 0; j < 3; j++)
                if (!board[i][j])
                return true
        return false
    }

    function evaluate(board) {
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                if (board[i][0] === player)
                    return +10;
                else if (board[i][0] === ai) //ai
                    return -10;
            }
        }

        for (let i = 0; i < 3; i++) {
            if (board[0][i] == board[1][i] && board[1][i] === board[2][i]) {
                if (board[0][i] === player)
                    return +10
                else if (board[0][i] === ai)//ai
                    return -10
            }
        }

        if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            if (board[0][0] == player)
                return +10;
                
            else if (board[0][0] == ai)//ai
                return -10;
        }
    
        if (board[0][2] == board[1][1] &&
            board[1][1] == board[2][0])
        {
            if (board[0][2] == player)
                return +10;
                
            else if (board[0][2] == ai)//ai
                return -10;
        }
        return 0;
    }

    function minimax(board, depth, isMax) {
        let score = evaluate(board)

        if (score === 10) return score;

        if (score === -10) return score;

        if (isMoveLeft(board) === false) return 0;

        if (isMax) {
            let best = -1000;

            for(let i = 0; i< 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (!board[i][j]) {
                        board[i][j] = player;
                        best = Math.max(best, minimax(board, depth + 1, !isMax))
                        board[i][j] = ''
                    }
                }
            }
            return best;
        } else {
            let best = 1000;

            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    if (!board[i][j]) {
                        board[i][j] = ai;//ai
                        best = Math.min(best, minimax(board, depth + 1, !isMax))
                        board[i][j] = '';
                    }
                }
            }
            return best;
        }
    }

    function findBestMove(board) {
        let bestVal = -1000;
        let bestMove = {};
        bestMove.row = -1;
        bestMove.col = -1;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!board[i][j]) {
                    board[i][j] = player;
                    let moveVal = minimax(board, 0, false);
                    board[i][j] = '';

                    if (moveVal > bestVal) {
                        bestMove.row = i;
                        bestMove.col = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        return bestMove;
    }

    return { findBestMove }

})();