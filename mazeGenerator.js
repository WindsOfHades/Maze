class MazeGenerator {
    constructor(rows, columns) {
        this.grid = new Grid(rows, columns);
        this.startingRow = Math.floor(Math.random() * rows);
        this.startingColumn = Math.floor(Math.random() * columns);
        this.horizontals = Array(rows - 1).fill(null).map(() => { return Array(columns).fill(false) });
        this.verticals = Array(rows).fill(null).map(() => { return Array(columns - 1).fill(false) });
        this.traversGrid(this.startingRow, this.startingColumn);
    }

    getWalls = () => {
        return {
            horizontalWalls: this.horizontals,
            verticalWalls: this.verticals
        }
    }

    traversGrid = (row, column) => {
        // make current cell visited
        this.grid.visitCell(row, column);
        // shuffeling is necessary to get a random Maze each time
        const neighbours = this.shuffleNeighbours(this.grid.getNeighbours(row, column));

        for (const neighbour of neighbours) {
            const [neighbourRow, neighbourColumn, direction] = neighbour;
            if (this.grid.isCellValid(neighbourRow, neighbourColumn)) continue;
            if (this.grid.isCellVisited(neighbourRow, neighbourColumn)) continue;
            this.removeWall(row, column, direction);
            this.traversGrid(neighbourRow, neighbourColumn);
        }
    }

    removeWall = (row, column, direction) => {
        if (direction === "left") {
            this.verticals[row][column - 1] = true;
        } else if (direction === "right") {
            this.verticals[row][column] = true;
        } else if (direction === "top") {
            this.horizontals[row - 1][column] = true;
        } else {
            this.horizontals[row][column] = true;
        }
    }

    shuffleNeighbours = (arr) => {
        let counter = arr.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = arr[counter];
            arr[counter] = arr[index];
            arr[index] = temp;
        }
        return arr;
    }
}
