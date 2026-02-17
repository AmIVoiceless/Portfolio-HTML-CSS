class Game {
    constructor() {
        this.board = new Board();
        this.currentPlayer = "white";
        this.selectedPiece = null;
    }

    start() {
        this.board.init();
        this.setupPieces();
        this.board.render();
        this.addListeners();
    }

    setupPieces() {
        for (let i = 0; i < 8; i++) {
            this.board.placePiece(new Pawn("white", files[i] + "2"));
            this.board.placePiece(new Pawn("black", files[i] + "7"));
        }
    }

    addListeners() {
        const boardElement = document.getElementById("board");

        boardElement.addEventListener("click", (e) => {
            const cell = e.target.closest(".chess-cell");
            if (!cell) return;

            const position = cell.dataset.position;
            const piece = this.board.getPiece(position);

            if (piece && piece.color === this.currentPlayer) {
                this.selectPiece(piece);
                return;
            }

            if (this.selectedPiece) {
                this.tryMove(position);
            }
        });

        document.getElementById("newGame")
            .addEventListener("click", () => {
                location.reload();
            });
    }

    selectPiece(piece) {
        this.clearHighlights();
        this.selectedPiece = piece;

        const moves = piece.getValidMoves(this.board);

        moves.forEach(pos => {
            const cell = document.querySelector(
                `.chess-cell[data-position='${pos}']`
            );
            if (cell) cell.classList.add("chess-move");
        });
    }

    tryMove(position) {
        const moves = this.selectedPiece.getValidMoves(this.board);

        if (moves.includes(position)) {
            this.board.movePiece(
                this.selectedPiece.position,
                position
            );
            this.switchTurn();
        }

        this.selectedPiece = null;
        this.clearHighlights();
    }

    switchTurn() {
        this.currentPlayer =
            this.currentPlayer === "white"
                ? "black"
                : "white";

        document.getElementById("turn").textContent =
            this.currentPlayer === "white"
                ? "Ход белых"
                : "Ход черных";
    }

    clearHighlights() {
        document.querySelectorAll(".chess-cell")
            .forEach(c => c.classList.remove("chess-move"));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    game.start();
});