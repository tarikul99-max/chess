// script.js - Advanced Chess Engine

const canvas = document.getElementById("chessBoard");
const ctx = canvas.getContext("2d");
const S = 50; 

// ১. বোর্ড রিপ্রেজেন্টেশন (অবজেক্ট দিয়ে তৈরি)
let board = Array(8).fill(null).map(() => Array(8).fill(null));

function initBoard() {
    const layout = ['r','n','b','q','k','b','n','r'];
    for(let i=0; i<8; i++) {
        board[0][i] = { type: layout[i], color: 'BLACK' };
        board[1][i] = { type: 'p', color: 'BLACK' };
        board[6][i] = { type: 'p', color: 'WHITE' };
        board[7][i] = { type: layout[i], color: 'WHITE' };
    }
}

// ইউনিকোড সিম্বল ম্যাপ
const pieceSymbols = { 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙' };

// ২. পথ বাধা চেক করার লজিক
function isPathClear(from, to, board) {
    let dr = Math.sign(to.r - from.r);
    let dc = Math.sign(to.c - from.c);
    let r = from.r + dr, c = from.c + dc;
    while (r !== to.r || c !== to.c) {
        if (board[r][c]) return false;
        r += dr; c += dc;
    }
    return true;
}

// ৩. মুভমেন্ট ভ্যালিডেশন (Pseudo-Legal)
function isValidMove(from, to, board) {
    let piece = board[from.r][from.c];
    let target = board[to.r][to.c];
    if (!piece || (target && target.color === piece.color)) return false;

    let dr = to.r - from.r;
    let dc = to.c - from.c;

    switch(piece.type) {
        case 'p':
            let dir = (piece.color === 'WHITE') ? -1 : 1;
            if (dc === 0 && dr === dir && !target) return true;
            if (Math.abs(dc) === 1 && dr === dir && target) return true;
            return false;
        case 'n': return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
        case 'r': return (dr === 0 || dc === 0) && isPathClear(from, to, board);
        case 'b': return (Math.abs(dr) === Math.abs(dc)) && isPathClear(from, to, board);
        case 'q': return (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) && isPathClear(from, to, board);
        case 'k': return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
        default: return false;
    }
}

// ৪. বোর্ড রেন্ডার করা
function render() {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863";
            ctx.fillRect(c * S, r * S, S, S);
            let p = board[r][c];
            if (p) {
                ctx.fillStyle = (p.color === 'WHITE') ? "white" : "black";
                ctx.font = "40px Arial";
                ctx.textAlign = "center";
                // টাইপ অনুযায়ী সিম্বল বসানো
                let symbol = p.type;
                if(p.color === 'WHITE') symbol = symbol.toUpperCase();
                ctx.fillText(pieceSymbols[symbol], c * S + 25, r * S + 35);
            }
        }
    }
}

// ৫. মাউস ক্লিক হ্যান্ডলার
let selected = null;
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    let c = Math.floor((e.clientX - rect.left) / S);
    let r = Math.floor((e.clientY - rect.top) / S);

    if (selected) {
        if (isValidMove(selected, {r, c}, board)) {
            board[r][c] = board[selected.r][selected.c];
            board[selected.r][selected.c] = null;
        }
        selected = null;
    } else if (board[r][c]) {
        selected = {r, c};
    }
    render();
});

initBoard();
render();
