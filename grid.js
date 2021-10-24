class Grid {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.grid = Array(this.rows).fill(null).map(() => { return Array(this.columns).fill(false) });
    }

    visitCell = (row, column) => {
        this.grid[row][column] = true;
    }

    isCellVisited = (row, column) => {
        return this.grid[row][column];
    }

    isCellValid = (row, column) => {
        if (row >= this.rows || row < 0 || column >= this.columns || column < 0) {
            return true;
        }
        return false
    }

    getNeighbours = (row, column) => {
        return [[row + 1, column, 'bottom'],
        [row - 1, column, 'top'],
        [row, column - 1, 'left'],
        [row, column + 1, 'right']]
    }
}
