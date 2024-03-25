class Level {
    constructor(width, height, cells, clear = false) {
        if (width < 1 || height < 1) {
            throw new Error('Width and height must be greater than 0');
        };
        this.width = width;
        this.height = height;
        if (cells == undefined) {
            this.cells = new Array();
            for (let row = 0; row < this.height; row++) {
                for (let column = 0; column < this.width; column++) {
                    let cell = new Cell(row, column);
                    if (Math.random() > .5 && !clear) {
                        cell.giveLife();
                    };
                    this.cells.push(cell);
                };
            };
        } else {
            if (cells.length != width * height) {
                throw new Error('Cells must be equal to width * height');
            };
            this.cells = cells;
        };
    };

    __str__() {
        let display = "";
        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                display += this.getCell(row, column).isAlive() ? "X" : "O";
            };
            display += "\n";
        };
        return display;
    }

    getCell(x, y) {
        for (let cell of this.cells) {
            if (cell.x == x && cell.y == y) {
                return cell;
            };
        }
    };

    getCells() {
        return this.cells;
    }

    findNeighbors(cell) {
        let neighbors = []
        for (let row = cell.x - 1; row <= cell.x + 1; row++) {
            if (row > -1 && row < this.height) {
                for (let column = cell.y - 1; column <= cell.y + 1; column++)
                    if (column > -1 && column < this.width) {
                        if (row !== cell.x || column !== cell.y) {
                            neighbors.push(this.getCell(row, column));
                        };
                    };
                };
            };
        return neighbors;
    };

    update() {
        let newCells = []
        for (let cell of this.cells){
            let aliveNeighbors = this.findNeighbors(cell).filter(neighbor => neighbor.isAlive()).length;
            let newCell = new Cell(cell.x, cell.y);
            if (aliveNeighbors == 2 && cell.isAlive()) {
                newCell.giveLife()
            } else if (aliveNeighbors == 3) {
                newCell.giveLife();
            };
            newCells.push(newCell);
        };
        return new Level(this.width, this.height, newCells);
    };
};

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = false;
    };

    isAlive() {
        return this.alive;
    };

    giveLife() {
        this.alive = true;
    };

    kill() {
        this.alive = false;
    };
};

class DOMDisplay {
    constructor(level){
        this.ALIVECOLOR = "green"
        this.DEADCOLOR = "grey"
        let displayArea = document.querySelector('div#game');

        // Get the viewport size
        let viewportWidth = window.innerWidth * .98;
        let viewportHeight = window.innerHeight * .7;

        // Calculate the size for each cell
        let cellWidth = Math.min(viewportWidth, 500) / level.width;
        let cellHeight = Math.min(viewportHeight, 500) / level.height;

        let gameTable = document.createElement("table");
        let gameRow = document.createElement("tr");
        let counter = 0;

        let mouseDown = false;
        document.addEventListener('mousedown', () => mouseDown = true);
        document.addEventListener('mouseup', () => mouseDown = false);

        for (let cell of level.getCells()) {
            if (counter >= level.width) {
                gameTable.appendChild(gameRow);
                gameRow = document.createElement("tr");
                counter = 0;
            }
            let block = document.createElement("td");
            block.style.width = cellWidth + "px";
            block.style.height = cellHeight + "px";
            block.style.backgroundColor = cell.isAlive() ? this.ALIVECOLOR : this.DEADCOLOR;
            block.addEventListener('mouseover', () => {
                if (mouseDown) {    
                    if (cell.isAlive()) {
                            cell.kill();
                            block.style.backgroundColor = this.DEADCOLOR;
                            block.removeEventListener('mouseover', () => {});
                        } else {
                            cell.giveLife();
                            block.style.backgroundColor = this.ALIVECOLOR;
                            block.removeEventListener('mouseover', () => {});
                        };
                    }
            });
            block.addEventListener('mousedown', () => {
                if (cell.isAlive()) {
                    cell.kill();
                    block.style.backgroundColor = this.DEADCOLOR;
                    block.removeEventListener('mouseover', () => {});
                } else {
                    cell.giveLife();
                    block.style.backgroundColor = this.ALIVECOLOR;
                    block.removeEventListener('mouseover', () => {});
                }
            });
            gameRow.appendChild(block);
            counter++;            
        };
        gameTable.appendChild(gameRow);
        displayArea.appendChild(gameTable);
    };

    clear() {
        let displayArea = document.querySelector('div#game');
        displayArea.innerHTML = "";
    }
};

function playGame(level) {
    let display = new DOMDisplay(level);
    function update() {
        display.clear();
        let newLevel = level.update();
        new DOMDisplay(newLevel);
        level = newLevel;
    }
    let iterator = document.querySelector('button#next');
    iterator.addEventListener('click', () => {
        update();
    });
};


let randomGame = document.querySelector('button#random');
randomGame.addEventListener('click', () => {
    if (document.querySelector('div#game').innerHTML != "") {
        document.querySelector('div#game').innerHTML = "";
    }
    let testLevel = new Level(30, 30);
    playGame(testLevel);
});

let customGame = document.querySelector('button#custom');
customGame.addEventListener('click', () => {
    if (document.querySelector('div#game').innerHTML != "") {
        document.querySelector('div#game').innerHTML = "";
    }
    let width = prompt('Enter the width of the game board');
    let height = prompt('Enter the height of the game board');
    let testLevel = new Level(width, height, cells=undefined, clear = true);
    playGame(testLevel);
});

