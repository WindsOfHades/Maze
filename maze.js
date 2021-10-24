const height = document.querySelector(".container").clientHeight;
const width = document.querySelector(".container").clientWidth;
// const height = document.querySelector(".container").clientHeight;
// const width = document.querySelector(".container").clientWidth;
console.log(height, width);
// const height = 600;
// const width = 800;
const gridRows = 10;
const gridColumns = 10;
const cellWidth = width / gridColumns;
const cellHeight = height / gridRows;
const ballSpeed = 3;

const { Runner, World, Engine, Render, Bodies, Body, Events } = Matter;
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.querySelector(".container"),
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

const maze = new MazeGenerator(gridRows, gridColumns);

// Render Maze
maze.getWalls().horizontalWalls.forEach((row, rowIndex) => {
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

maze.getWalls().verticalWalls.forEach((row, rowIndex) => {
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
