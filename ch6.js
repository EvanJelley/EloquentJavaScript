let protoRabbit = {
    type: 'proto',
    speak(line) {
        console.log(`The ${this.type} rabbit says '${line}'`);
    }
};
let killerRabbit = Object.create(protoRabbit);
killerRabbit.type = "killer";
// killerRabbit.speak("SKREEEE!");


class Matrix {
    constructor(width, height, element = (x, y) => undefined) {
        this.width = width;
        this.height = height;
        this.content = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.content[y * width + x] = element(x, y);
            }
        }
    }

    get(x, y) {
        return this.content[y * this.width + x];
    }
    set(x, y, value) {
        this.content[y * this.width + x] = value;
    }
}

let testMatrix = new Matrix(10, 10, () => "Bob the builder")
// console.log(testMatrix.get(4, 2))
testMatrix.set(4, 2, "Bob the destroyer")
// console.log(testMatrix.get(4, 2))
// console.log(testMatrix.content)

class MatrixIterator {
    constructor(matrix) {
        this.x = 0;
        this.y = 0;
        this.matrix = matrix;
    }

    next() {
        if (this.y == this.matrix.height) return { done: true };

        let value = {
            x: this.x,
            y: this.y,
            value: this.matrix.get(this.x, this.y)
        };
        this.x++;
        if (this.x == this.matrix.width) {
            this.x = 0;
            this.y++;
        }
        return { value, done: false };
    }
}

// Exercise 1
class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
    plus(otherVec) {
        return new Vec(this.x + otherVec.x, this.y + otherVec.y)
    }
    minus(otherVec) {
        return new Vec(this.x - otherVec.x, this.y - otherVec.y)
    }
    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }
}

// Exercise 2
class Group {
    constructor() {
        this.items = []
    }
    add(item) {
        if (!this.items.includes(item)) this.items.push(item)
    }
    delete(item) {
        let index = this.items.indexOf(item)
        if (index > -1) this.items.splice(index, 1)
    }
    has(item) {
        if (this.items.includes(item)) {
            return true
        } else {
            return false
        }
    }
    static from(iterable) {
        let group = new Group()
        for (let entry of iterable) {
            group.add(entry)
        }
        return group
    }
    [Symbol.iterator]() {
        return new GroupIterator(this)
    }
}

// Exercise 3
class GroupIterator {
    constructor(group) {
        this.index = 0;
        this.group = group.items;
    }

    next() {
        if (this.index == this.group.length) return { done: true };
        let value = this.group[this.index];
        this.index++;
        return { value, done: false };
    }
}

// Exercise 4
let map = {one: true, two: true, hasOwnProperty: true};

// Fix this call
console.log(Object.prototype.hasOwnProperty.call(map, "one"));