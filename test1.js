const ps = require(`prompt-sync`);
const prompt = ps();
let userAddress;
let turn;
let enemy;
let botTurn;
let botChoose;
let origBoard = new Array(0);
const noughts  = "O";
const crosses = "X";
let bestSpot = minimax(origBoard, noughts );
function minimax(newBoard, player) {
    let availSpots = emptyIndices(newBoard);

    if (winning(newBoard, noughts )) {
        return {score: -10};
    } else if (winning(newBoard, crosses)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;
        if (player === crosses) {
            let result = minimax(newBoard, noughts );
            move.score = result.score;
        } else {
            let result = minimax(newBoard, crosses);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }
    let bestMove;
    if (player === crosses) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function emptyIndices(board) {
    return board.filter(s => s !== "O" && s !== "X");
}
function winning(board, player) {
    if (
        (board[0] === player && board[1] === player && board[2] === player) ||
        (board[3] === player && board[4] === player && board[5] === player) ||
        (board[6] === player && board[7] === player && board[8] === player) ||
        (board[0] === player && board[3] === player && board[6] === player) ||
        (board[1] === player && board[4] === player && board[7] === player) ||
        (board[2] === player && board[5] === player && board[8] === player) ||
        (board[0] === player && board[4] === player && board[8] === player) ||
        (board[2] === player && board[4] === player && board[6] === player)
    ) {
        return true;
    } else {
        return false;
    }
}

function boardUpdate() {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].occupation === ` `) {
            origBoard.splice(i, 1, i);
        } else {
            origBoard.splice(i, 1, cells[i].occupation);
        }
    }
}

const botMove = (type) => {
    do {
        botTurn = false;
        botChoose = RandomInt(0, 8);
        if (cells[botChoose].occupation === ` `) {
            cells[botChoose].occupation = type;
            botTurn = true;
        }
    } while (!botTurn)
}

class Cell {
    address = 0;
    occupation;
    static count = 0;

    constructor() {
        this.address = Cell.count;
        this.occupation = ` `;
        Cell.count++
    }
}

let botTypeConfirmation;
let tieCounter;
let playingBool;
let exitConfirm;
let exitBool = false;
let cells = new Array(0)
let newCell;
let turnConfirm;
for (let i = 0; i < 9; i++) {
    newCell = new Cell();
    cells.push(newCell)
}
for (let i = 0; i < 9; i++) {
    origBoard.push(i);
}
const nullifyTable = () => {
    for (let i = 0; i < 9; i++) {
        newCell = new Cell();
        cells.splice(i, 1, newCell);
    }
}
const winCheck = () => {
    tieCounter = 0;
    for (let i = 0; i < cells.length; i++) {
        if ((i === 0 || i === 1 || i === 2) && cells[i].occupation !== ` ` && cells[i].occupation === cells[i + 3].occupation && cells[i + 3].occupation === cells[i + 6].occupation) {
            return true;
        } else if (i === 0 && cells[i].occupation !== ` ` && cells[i].occupation === cells[i + 4].occupation && cells[i + 4].occupation === cells[i + 8].occupation) {
            return true;
        } else if (i === 2 && cells[i].occupation !== ` ` && cells[i].occupation === cells[i + 2].occupation && cells[i + 2].occupation === cells[i + 4].occupation) {
            return true;
        } else if ((i === 0 || i === 3 || i === 6) && cells[i].occupation !== ` ` && cells[i].occupation === cells[i + 1].occupation && cells[i + 1].occupation === cells[i + 2].occupation) {
            return true;
        }
    }
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].occupation !== ` `) {
            tieCounter++
        }
    }
    if (tieCounter === 9) {
        return false;
    }
}
const printMatrix = () => {
    console.log(`_______________`);
    for (let i = 0; i < cells.length; i++) {
        if (i === 2) {
            console.log(`| ${cells[i - 2].occupation} || ${cells[i - 1].occupation} || ${cells[i].occupation} |`);
        } else if (i === 5) {
            console.log(`| ${cells[i - 2].occupation} || ${cells[i - 1].occupation} || ${cells[i].occupation} |`);
        } else if (i === 8) {
            console.log(`| ${cells[i - 2].occupation} || ${cells[i - 1].occupation} || ${cells[i].occupation} |`);
        }
    }
    console.log(`_______________`);
}
do {
    enemy = parseInt(prompt(`Выберите тип игры, нажмите 1, если хотите сыграть вдвоем или 0, если против бота: `));
    if (enemy === 1) {
        let turn = 2;
        playingBool = false;
        do {
            userAddress = parseInt(prompt(`Пользователь${turn - 1} введите номер ячейки: `));
            if (isNaN(userAddress) || userAddress > cells.length || userAddress < 0) {
                console.log(`Введите коректное число!`)
            } else {
                if (cells[userAddress].occupation !== ` `) {
                    console.log(`Ячейка занята`);
                } else {
                    if (turn % 2 === 0) {
                        cells[userAddress].occupation = `X`;
                        turn++;
                    } else if (turn % 2 !== 0) {
                        cells[userAddress].occupation = `O`;
                        turn = 2;
                    }
                    console.clear();
                    printMatrix();
                    winCheck();
                    if (winCheck() === true) {
                        console.log(`Игра завершена!`);
                        if(turn === 3){
                            console.log(`Пользователь1 победил!`);
                        }
                        else{
                            console.log(`Пользователь2 победил!`);
                        }
                        nullifyTable();
                        exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                        if (exitConfirm === 0) {
                            playingBool = true;
                            exitBool = true;
                        } else {
                            playingBool = true;
                        }
                    } else if (winCheck() === false) {
                        console.log(`Игра завершена!`);
                        console.log(`Победитель не был выявлен!`);
                        nullifyTable();
                        exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                        if (exitConfirm === 0) {
                            playingBool = true;
                            exitBool = true;
                        } else {
                            playingBool = true;
                        }
                    }
                }
            }
        } while (!playingBool)
    } else {
        botTypeConfirmation = parseInt(prompt(`Выберите режим сложности. Нажмите 1 ,если хотите сыграть против легкого бота
        или нажмите 0, если против бота Монстра: `));
        if (botTypeConfirmation === 1) {
            turnConfirm = parseInt(prompt(`Выберите за кого хотите играть. Нажмите 1,ели за крестиков или любое другое число
            если за ноликов: `));
            if(turnConfirm === 1) {
                do {
                    userAddress = parseInt(prompt(`Введите номер ячейки: `));
                    if (isNaN(userAddress) || userAddress > cells.length || userAddress < 0) {
                        console.log(`Введите коректное число!`)
                    } else {
                        if (cells[userAddress].occupation !== ` `) {
                            console.log(`Ячейка занята`);
                        } else {
                            cells[userAddress].occupation = `X`
                        }
                    }
                    console.clear();
                    printMatrix();
                    winCheck();
                    if (winCheck() === true) {
                        console.log(`Игра завершена!`);
                        console.log(`Пользователь победил!`);
                        nullifyTable();
                        exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                        if (exitConfirm === 0) {
                            playingBool = true;
                            exitBool = true;
                        } else {
                            playingBool = true;
                        }
                    } else if (winCheck() === false) {
                        console.log(`Игра завершена! `);
                        console.log(`Победитель не был выявлен!`);
                        nullifyTable();
                        exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                        if (exitConfirm === 0) {
                            playingBool = true;
                            exitBool = true;
                        } else {
                            playingBool = true;
                        }
                    } else {
                        console.log(`Ход бота: `)
                        botMove(noughts );
                        printMatrix();
                        winCheck();
                        if (winCheck() === true) {
                            console.log(`Игра завершена!`);
                            console.log(`Бот победил!`);
                            nullifyTable();
                            exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                            if (exitConfirm === 0) {
                                playingBool = true;
                                exitBool = true;
                            } else {
                                playingBool = true;
                            }
                        }
                    }
                } while (!playingBool)
            }
            else {
                do {
                    console.log(`Ход бота: `)
                    botMove(crosses);
                    printMatrix();
                    winCheck();
                    if (winCheck() === true) {
                        console.log(`Игра завершена!`);
                        console.log(`Вы проиграли!`);
                        nullifyTable();
                        exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                        if (exitConfirm === 0) {
                            playingBool = true;
                            exitBool = true;
                        } else {
                            playingBool = true;
                        }
                    }
                    else{
                        userAddress = parseInt(prompt(`Введите номер ячейки: `));
                        if (isNaN(userAddress) || userAddress > cells.length || userAddress < 0) {
                            console.log(`Введите коректное число!`)
                        } else {
                            if (cells[userAddress].occupation !== ` `) {
                                console.log(`Ячейка занята`);
                            } else {
                                cells[userAddress].occupation = `O`
                            }
                        }
                        console.clear();
                        printMatrix();
                        winCheck();
                        if (winCheck() === true) {
                            console.log(`Игра завершена`);
                            console.log(`Вы победили!`);
                            nullifyTable();
                            exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                            if (exitConfirm === 0) {
                                playingBool = true;
                                exitBool = true;
                            } else {
                                playingBool = true;
                            }
                        } else if (winCheck() === false) {
                            console.log(`Игра завершена  `);
                            console.log(`Победитель не был выявлен!`);
                            nullifyTable();
                            exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                            if (exitConfirm === 0) {
                                playingBool = true;
                                exitBool = true;
                            } else {
                                playingBool = true;
                            }
                        }
                    }
                }while (!playingBool)
            }
        } else {
            turnConfirm = parseInt(prompt(`Выберите за кого хотите играть. Нажмите 1,ели за крестиков или любое другое число
            если за ноликов: `));
            if (turnConfirm === 1) {
                do {
                    userAddress = parseInt(prompt(`Введите номер ячейки: `));
                    if (isNaN(userAddress) || userAddress > cells.length || userAddress < 0) {
                        console.log(`Введите коректное число! `)
                    } else {
                        if (cells[userAddress].occupation !== ` `) {
                            console.log(`Ячейка занята`);
                        } else {
                            cells[userAddress].occupation = `X`
                        }
                    }
                    console.clear();
                    printMatrix();
                    winCheck();
                    if (winCheck() === true) {
                        console.log(`Игра завершена! `);
                        console.log(`Вы победили!`);
                        nullifyTable();
                        exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                        if (exitConfirm === 0) {
                            playingBool = true;
                            exitBool = true;
                        } else {
                            playingBool = true;
                        }
                    } else if (winCheck() === false) {
                        console.log(`Игра завершена `);
                        console.log(`Победитель не был выявлен!`);
                        nullifyTable();
                        exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                        if (exitConfirm === 0) {
                            playingBool = true;
                            exitBool = true;
                        } else {
                            playingBool = true;
                        }
                    } else {
                        boardUpdate();
                        console.log(`Ход бота: `)
                        bestSpot = minimax(origBoard, noughts );
                        console.log(bestSpot)
                        cells[bestSpot.index].occupation = `O`
                        printMatrix();
                        winCheck();
                        if (winCheck() === true) {
                            console.log(`Игра завершена!`);
                            console.log(`Вы проиграли`);
                            nullifyTable();
                            exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                            if (exitConfirm === 0) {
                                playingBool = true;
                                exitBool = true;
                            } else {
                                playingBool = true;
                            }
                        }
                    }
                } while (!playingBool)
            } else {
                do {
                    console.clear();
                    printMatrix();
                    console.log(`Ход бота: `)
                    bestSpot = minimax(origBoard, crosses);
                    console.log(bestSpot)
                    cells[bestSpot.index].occupation = `X`
                    printMatrix();
                    winCheck();
                    boardUpdate();
                    if (winCheck() === true) {
                        console.log(`Игра завершена! `);
                        console.log(`Вы проиграли!`);
                        nullifyTable();
                        exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                        if (exitConfirm === 0) {
                            playingBool = true;
                            exitBool = true;
                        } else {
                            playingBool = true;
                        }
                    } else if (winCheck() === false) {
                        console.log(`Игра завершена`);
                        console.log(`Победитель не был выявлен!`);
                        nullifyTable();
                        exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                        if (exitConfirm === 0) {
                            playingBool = true;
                            exitBool = true;
                        } else {
                            playingBool = true;
                        }
                    } else {
                        userAddress = parseInt(prompt(`Введите номер ячейки: `));
                        if (isNaN(userAddress) || userAddress > cells.length || userAddress < 0) {
                            console.log(`Введите коректное число! `)
                        } else {
                            if (cells[userAddress].occupation !== ` `) {
                                console.log(`Ячейка занята`);
                            } else {
                                cells[userAddress].occupation = `O`
                            }
                        }
                        console.clear();
                        printMatrix();
                        winCheck();
                        boardUpdate();
                        if (winCheck() === true) {
                            console.log(`Игра завершена!`);
                            console.log(`Вы победили!`);
                            nullifyTable();
                            exitConfirm = parseInt(prompt(`Желаете продолжить игру? Если да, то нажмите 1 или 0, если нет: `));
                            if (exitConfirm === 0) {
                                playingBool = true;
                                exitBool = true;
                            } else {
                                playingBool = true;
                            }
                        }
                    }
                } while (!playingBool)
            }
        }
    }
} while (!exitBool)

function RandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
