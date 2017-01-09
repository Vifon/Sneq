var Apple = Qt.createComponent("Apple.qml");
var Snake = Qt.createComponent("SnakeSegment.qml");

var grid;
var snake;
var apple;

function initialize() {
    grid = [];
    for (var i = 0; i < gameArea.gameSize; ++i) {
        grid.push([]);
    }

    score.points = 0;

    apple = Apple.createObject(gameArea);
    placeApple(apple);

    snake = [];
    snake.push(Snake.createObject(gameArea));
    grid[snake[0].x][snake[0].y] = snake[0];

    stepTimer.restart();
}

function cleanup() {
    apple.destroy();
    for (var i = 0; i < snake.length; ++i) {
        snake[i].destroy();
    }
}

function placeApple(apple) {
    while (true) {
        var x = Math.floor(Math.random() * gameArea.gameSize);
        var y = Math.floor(Math.random() * gameArea.gameSize);
        if (!grid[x][y]) {
            break;
        }
    }

    grid[x][y] = apple;

    apple.x_pos = x;
    apple.y_pos = y;
}

function step() {
    var last_pos = null;
    for (var i = 0; i < snake.length; ++i) {
        var segment = snake[i];
        var dx = segment.velocity[0];
        var dy = segment.velocity[1];

        var this_pos = [segment.x_pos, segment.y_pos];
        if (i == 0) {
            segment.x_pos += dx;
            segment.y_pos += dy;
            if (isGameover()) {
                cleanup();
                initialize();
                return;
            }
        } else {
            segment.x_pos = last_pos[0];
            segment.y_pos = last_pos[1];
        }
        last_pos = this_pos;

        if (grid[snake[0].x_pos][snake[0].y_pos] === apple) {
            eat();
        }

        if (i < snake.length-1) {
            grid[segment.x_pos][segment.y_pos] = snake[i+1];
        } else {
            grid[segment.x_pos][segment.y_pos] = null;
        }
    }
}

function isGameover() {
    return (snake[0].x_pos < 0 || snake[0].x_pos >= gameArea.gameSize ||
            snake[0].y_pos < 0 || snake[0].y_pos >= gameArea.gameSize);
}

function eat() {
    placeApple(apple);
    snake.push(Snake.createObject(gameArea));
    score.points += 1;
}

function onPressed(event) {
    if (event.key === Qt.Key_R) {
        cleanup();
        initialize();
    } else if (event.key === Qt.Key_Q) {
        Qt.quit();
    }

    if (snake[0].velocity[0] === 0) {
        if (event.key === Qt.Key_Left) {
            snake[0].velocity = [-1, 0];
            step();
        } else if (event.key === Qt.Key_Right) {
            snake[0].velocity = [1, 0];
            step();
        } else {
            return;
        }
    } else {
        if (event.key === Qt.Key_Up) {
            snake[0].velocity = [0, -1];
            step();
        } else if (event.key === Qt.Key_Down) {
            snake[0].velocity = [0, 1];
            step();
        } else {
            return;
        }
    }

    stepTimer.restart();
}
