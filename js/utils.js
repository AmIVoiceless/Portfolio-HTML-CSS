const files = ['a','b','c','d','e','f','g','h'];

function positionToCoords(pos) {
    return {
        col: files.indexOf(pos[0]),
        row: 8 - parseInt(pos[1])
    };
}

function coordsToPosition(row, col) {
    return files[col] + (8 - row);
}

function isInsideBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}