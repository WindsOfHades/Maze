const height = window.innerHeight;
const width = window.innerWidth;
const gridRows = 10;
const gridColumns = 10;
const cellWidth = width / gridColumns;
const cellHeight = height / gridRows;
const ballSpeed = 3;

const { Runner, World, Engine, Render, Bodies, Body, Events } = Matter;
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        height: height,
        width: width
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);


const boarders = [
    Bodies.rectangle((width / 2), 0, width, 2, { isStatic: true }),
    Bodies.rectangle((width / 2), height, width, 2, { isStatic: true }),
    Bodies.rectangle(0, (height / 2), 2, height, { isStatic: true }),
    Bodies.rectangle(width, (height / 2), 2, height, { isStatic: true }),
];

World.add(world, boarders);

const toggleGravity = (gravity) => {
    engine.world.gravity.y = gravity ? 1 : 0;
}

const grid = Array(gridRows).fill(null).map(() => { return Array(gridColumns).fill(false) });
const horizontals = Array(gridRows - 1).fill(null).map(() => { return Array(gridColumns).fill(false) });
const verticals = Array(gridRows).fill(null).map(() => { return Array(gridColumns - 1).fill(false) });

const startingRow = Math.floor(Math.random() * gridRows);
const startingColumn = Math.floor(Math.random() * gridColumns);

const traversGrid = (row, column) => {
    // make current cell visited
    grid[row][column] = true;
    // shuffeling is necessary to get a random Maze each time
    const neighbours = shuffleNeighbours(getNeighbours(row, column));

    for (const neighbour of neighbours) {
        const [neighbourRow, neighbourColumn, direction] = neighbour;
        if (cellOutOfBound(neighbourRow, neighbourColumn)) continue;
        if (alreadyVisited(neighbourRow, neighbourColumn)) continue;
        removeWall(row, column, direction);
        traversGrid(neighbourRow, neighbourColumn);
    }
};

const removeWall = (row, column, direction) => {
    if (direction === "left") {
        verticals[row][column - 1] = true;
    } else if (direction === "right") {
        verticals[row][column] = true;
    } else if (direction === "top") {
        horizontals[row - 1][column] = true;
    } else {
        horizontals[row][column] = true;
    }
};

const alreadyVisited = (row, column) => (grid[row][column]);

const getNeighbours = (row, column) => {
    return [[row + 1, column, 'bottom'],
    [row - 1, column, 'top'],
    [row, column - 1, 'left'],
    [row, column + 1, 'right']]
}

const cellOutOfBound = (row, column) => {
    if (row >= gridRows || row < 0 || column >= gridColumns || column < 0) {
        return true;
    }
    return false
}

const shuffleNeighbours = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        let temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

traversGrid(startingRow, startingColumn);

// Render Maze
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * cellWidth + cellWidth / 2,
            rowIndex * cellHeight + cellHeight,
            cellWidth,
            5,
            { isStatic: true, label: "wall" });
        World.add(world, wall);
    });
});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * cellWidth + cellWidth,
            rowIndex * cellHeight + cellHeight / 2,
            5,
            cellHeight,
            { isStatic: true, label: "wall" });
        World.add(world, wall);
    });
});

// Goal
const goal = Bodies.rectangle(
    width - cellWidth / 2,
    height - cellHeight / 2,
    cellWidth * 0.7,
    cellHeight * 0.7,
    { isStatic: true, label: "goal" });
World.add(world, goal);

// Ball
const ball = Bodies.circle(cellWidth / 2, cellHeight / 2, cellHeight * 0.5 / 2, { label: "ball" });
World.add(world, ball);

// Key Events
document.addEventListener("keydown", (event) => {
    const { x, y } = ball.velocity;
    if (event.key === "w") {
        Body.setVelocity(ball, { x, y: y - ballSpeed });
    }
    else if (event.key === "d") {
        Body.setVelocity(ball, { x: x + ballSpeed, y });
    }
    else if (event.key === "s") {
        Body.setVelocity(ball, { x, y: y + ballSpeed });
    }
    else if (event.key === "a") {
        Body.setVelocity(ball, { x: x - ballSpeed, y });
    }
});

// toggle gravity
toggleGravity(false);

// Detect Win
Events.on(engine, "collisionStart", event => {
    const labels = ["ball", "goal"];
    event.pairs.forEach((collision) => {
        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            document.querySelector(".winner").classList.remove("hidden");
            toggleGravity(true);
            world.bodies.forEach((body) => {
                if (body.label === "wall") {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});
