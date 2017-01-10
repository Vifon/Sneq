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

    snake = [];
    snake.push(Snake.createObject(gameArea));
    grid[snake[0].x_pos][snake[0].y_pos] = snake[0];

    apple = Apple.createObject(gameArea);
    placeApple(apple);

    last_chance = true;

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

var last_chance = true;

function step() {
    var last_pos = null;
    var eat = false;
    for (var i = 0; i < snake.length; ++i) {
        var segment = snake[i];
        var dx = segment.velocity[0];
        var dy = segment.velocity[1];

        grid[segment.x_pos][segment.y_pos] = null;

        var this_pos = [segment.x_pos, segment.y_pos];
        if (i == 0) {
            segment.x_pos += dx;
            segment.y_pos += dy;
            if (isGameover()) {
                if (last_chance) {
                    segment.x_pos -= dx;
                    segment.y_pos -= dy;
                    last_chance = false;
                } else {
                    cleanup();
                    initialize();
                }
                return;
            }
        } else {
            segment.x_pos = last_pos[0];
            segment.y_pos = last_pos[1];
        }
        last_pos = this_pos;

        if (grid[snake[0].x_pos][snake[0].y_pos] &&
                grid[snake[0].x_pos][snake[0].y_pos].objectName === "apple") {
            eat = true;
        }

        grid[segment.x_pos][segment.y_pos] = segment;
    }
    last_chance = true;
    if (eat) {
        omnomnom();
    }
}

function isGameover() {
    if (snake[0].x_pos < 0 || snake[0].x_pos >= gameArea.gameSize ||
            snake[0].y_pos < 0 || snake[0].y_pos >= gameArea.gameSize) {
        // Border collision.
        return true;
    } else if (grid[snake[0].x_pos][snake[0].y_pos] &&
               grid[snake[0].x_pos][snake[0].y_pos].objectName === "snake") {
        // Tail.
        return true;
    } else {
        return false;
    }
}

function omnomnom() {
    var new_segment = Snake.createObject( gameArea, {
                                             x_pos: snake[0].x_pos,
                                             y_pos: snake[0].y_pos });
    snake.push(new_segment);
    grid[snake[snake.length-1].x_pos][snake[snake.length-1].y_pos] = new_segment;
    score.points += 1;
    placeApple(apple);
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
            last_chance = false;
            step();
        } else if (event.key === Qt.Key_Right) {
            snake[0].velocity = [1, 0];
            last_chance = false;
            step();
        } else {
            return;
        }
    } else {
        if (event.key === Qt.Key_Up) {
            snake[0].velocity = [0, -1];
            last_chance = false;
            step();
        } else if (event.key === Qt.Key_Down) {
            snake[0].velocity = [0, 1];
            last_chance = false;
            step();
        } else {
            return;
        }
    }

    stepTimer.restart();
}
