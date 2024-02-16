// Higher Order Functions
function greaterThan(n) {
    return m => m > n;
}


let greaterThan10 = greaterThan(10);

function repeat(n, action) {
    for (let i = 0; i < n; i++) {
        action(i);
    }
}

function unless(test, then) {
    if (!test) then();
}

// repeat(8, n => {
//     unless(n % 2 == 1, () => {
//         console.log(n, "is even");
//     });
// });

let SCRIPTS = require('./05_higher_order/code/scripts.js');

function filter(array, test) {
    let passed = [];
    for (let element of array) {
        if (test(element)) {
            passed.push(element);
        }
    }
    return passed;
}

function average(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

// console.log(Math.round(average(SCRIPTS.filter(s => s.living).map(s => s.year))));

// console.log(Math.round(average(SCRIPTS.filter(s => !s.living).map(s => s.year))));

// Exercise 1
let arrays = [2, [1, 2, 3], [4, 5], [6]];

function flatten(arr) {
    newArr = arr.reduce((a, value) => a.concat(value), [])
    return newArr
}

// Exercise 2
function loop(input, test, update, body) {
    while (test(input)) {
        body(input);
        input = update(input);
    }
}

// Exercise 3
function everyLoop(array, test) {
    for (let item of array) {
        if (!test(item)) {
            return false
        }
    }
    return true
}

function everySome(array, test) {
    if (array.some(n => !test(n))) {
        return false
    }
    return true
}

// Exercise 4

function countBy(items, groupName) {
    let counts = [];
    for (let item of items) {
        let name = groupName(item);
        let known = counts.findIndex(c => c.name == name);
        if (known == -1) {
            counts.push({ name, count: 1 });
        } else {
            counts[known].count++;
        }
    }
    return counts;
}

function characterScript(code) {
    for (let script of SCRIPTS) {
        if (script.ranges.some(([from, to]) => {
            return code >= from && code < to;
        })) {
            return script;
        }
    }
    return null;
}

function directionScript(code) {
    for (let script of SCRIPTS) {
        if (script.ranges.some(([from, to]) => {
            return code >= from && code < to;
        })) {
            return script.name;
        }
    }
    return null;
}

function dominantDirection(string) {
    let scripts = countBy(string, char => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.direction : "none";
    }).filter(({ name }) => name != "none");
    return scripts.reduce((a, b) => {
        return a.count < b.count ? b : a;
      }).name
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl