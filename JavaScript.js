const canvas = document.getElementById("chessBoard");
const ctx = canvas.getContext("2d");
const S = 50; // স্কয়ার সাইজ
const pieces = { 'r':'♜','n':'♞','b':'♝','q':'♛','k':'♚','p':'♟', 'R':'♖','N':'♘','B':'♗','Q':'♕','K':'♔','P':'♙' };

let board = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
];

let selected = null;
let turn = 'white'; 

// অবস্টাকল চেকিং ফাংশন
function isPathClear(sr, sc, er, ec, board) {
    let dr = Math.sign(er - sr);
    let dc = Math.sign(ec - sc);
    let r = sr + dr;
    let c = sc + dc;
    while (r !== er || c !== ec) {
        if (board[r][c] !== null) return false;
        r += dr;
        c += dc;
    }
    return true;
}

// মুভমেন্টের নিয়ম (Validation Logic)
function isValidMove(sr, sc, er, ec, piece, board) {
    let type = piece.toLowerCase();
    let dr = er - sr;
    let dc = ec - sc;
    let target = board[er][ec];

    // একই রঙের পিস খাওয়া যাবে না
    if (target && (target === target.toUpperCase()) === (piece === piece.toUpperCase())) return false;

    if (type === 'p') {
        let dir = (piece === 'P') ? -1 : 1;
        if (dc === 0 && dr === dir && !target) return true;
        if (Math.abs(dc) === 1 && dr === dir && target) return true;
        return false;
    }
    if (type === 'n') return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    if (type === 'r') return (dr === 0 || dc === 0) && isPathClear(sr, sc, er, ec, board);
    if (type === 'b') return (Math.abs(dr) === Math.abs(dc)) && isPathClear(sr, sc, er, ec, board);
    if (type === 'q') return (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) && isPathClear(sr, sc, er, ec, board);
    if (type === 'k') return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    return false;
}

// বোর্ড রেন্ডার করা
function render() {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? "#f0d9b5" : "#b58863";
            ctx.fillRect(c * S, r * S, S, S);
            let p = board[r][c];
            if (p) {
                ctx.fillStyle = (p === p.toUpperCase()) ? "white" : "black";
                ctx.font = "40px Arial";
                ctx.textAlign = "center";
                ctx.fillText(pieces[p], c * S + 25, r * S + 35);
            }
        }
    }
}

// মাউস ক্লিক ইভেন্ট
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    let c = Math.floor((e.clientX - rect.left) / S);
    let r = Math.floor((e.clientY - rect.top) / S);

    if (selected) {
        if (isValidMove(selected.r, selected.c, r, c, selected.piece, board)) {
            board[r][c] = selected.piece;
            board[selected.r][selected.c] = null;
            turn = (turn === 'white') ? 'black' : 'white';
            document.getElementById("status").innerText = turn.toUpperCase() + "-এর চাল";
        }
        selected = null;
    } else if (board[r][c]) {
        let isWhite = board[r][c] === board[r][c].toUpperCase();
        if ((isWhite && turn === 'white') || (!isWhite && turn === 'black')) {
            selected = { r, c, piece: board[r][c] };
        }
    }
    render();
});

render();
