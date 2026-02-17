class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.type = "piece";
    }

    getValidMoves(board) {
        return [];
    }
}

class Pawn extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = "pawn";
    }

    getValidMoves(board) {
        let moves = [];
        let {row, col} = positionToCoords(this.position);
        let dir = this.color === "white" ? -1 : 1;

        let oneStep = row + dir;

        if (isInsideBoard(oneStep, col) &&
            !board.getPiece(coordsToPosition(oneStep, col))) {

            moves.push(coordsToPosition(oneStep, col));

            let startRow = this.color === "white" ? 6 : 1;
            let twoStep = row + dir * 2;

            if (row === startRow &&
                !board.getPiece(coordsToPosition(twoStep, col))) {
                moves.push(coordsToPosition(twoStep, col));
            }
        }

        [-1, 1].forEach(offset => {
            let newCol = col + offset;
            if (isInsideBoard(oneStep, newCol)) {
                let target = coordsToPosition(oneStep, newCol);
                let piece = board.getPiece(target);
                if (piece && piece.color !== this.color) {
                    moves.push(target);
                }
            }
        });

        return moves;
    }
}