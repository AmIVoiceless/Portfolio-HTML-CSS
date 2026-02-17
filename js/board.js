class Board {
    constructor() {
        this.grid = {};
    }

    init() {
        const boardElement = document.getElementById("board");
        boardElement.innerHTML = "";
        boardElement.className = "chess-board";

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {

                let cell = document.createElement("div");
                let position = coordsToPosition(row, col);

                cell.className = "chess-cell " +
                    ((row + col) % 2 === 0
                        ? "chess-light"
                        : "chess-dark");

                cell.dataset.position = position;

                boardElement.appendChild(cell);
            }
        }
    }

    getPiece(position) {
        return this.grid[position] || null;
    }

    placePiece(piece) {
        this.grid[piece.position] = piece;
    }

    movePiece(from, to) {

        if (this.grid[to]) {
            delete this.grid[to];
        }

        this.grid[to] = this.grid[from];
        this.grid[to].position = to;
        delete this.grid[from];

        this.render();
    }

    render() {
        document.querySelectorAll(".chess-cell").forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("chess-move");

            let piece = this.getPiece(cell.dataset.position);

            if (piece) {
                cell.textContent =
                    piece.color === "white" ? "♙" : "♟";
            }
        });
    }
}