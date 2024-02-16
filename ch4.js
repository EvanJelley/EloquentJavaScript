// Computing Correlation

function phi(table) {
    return (table[3] * table[0] - table[2] * table[1]) /
        Math.sqrt ((table[2] + table[3]) *
                   (table[0] + table[1]) *
                   (table[1] + table[3]) *
                   (table[0] + table[2]));
}

// console.log(phi([76, 9, 4, 1]));

function tableFor(event, journal) {
    let table = [0, 0, 0, 0];
    for (let i = 0; i < journal.length; i++) {
        let entry = journal[i], index = 0;
        if (entry.events.includes(event)) index += 1;
        if (entry.squirrel) index += 2;
        table[index] +=1;
    }
    return table;
}

let JOURNAL = require("./04_data/code/journal.js");

function journalEvents(journal) {
    let events = [];
    for (let entry of journal) {
        for (let event of entry.events) {
            if (!events.includes(event)) {
                events.push(event);
            }
        }
    }
    return events;
}

// UNCOMMENT TO SEE CORRELATED EVENTS

// for (let event of journalEvents(JOURNAL)) {
//     if (phi(tableFor(event, JOURNAL)) > 0.1 || phi(tableFor(event, JOURNAL)) < -0.1) {
//         console.log(event + ":", phi(tableFor(event, JOURNAL)));
//     }
// }


// More about arrays
let toDoList = [];
function remember(task) {
    toDoList.push(task);
}
function getTask() {
    return toDoList.shift();
}
function rememberUrgently(task) {
    toDoList.unshift(task);
}

remember("groceries");
remember("laundry");
rememberUrgently("homework");

function max(...numbers) {
    let result = -Infinity;
    for (let number of numbers) {
      if (number > result) result = number;
    }
    return result;
  }

// Excercise 1
function range (start, end, step = 1) {
    let arr = [];
    if (step > 0) {
        for (let i = start; i <= end; i += step) {
            arr.push(i);
        }
    } else {
        for (let i = start; i >= end; i += step) {
            arr.push(i);
        }
    }
    return arr;
}

function sum(arr) {
    tot = 0;
    for (let i of arr) {
        tot += i;
    }
    return tot;
}

//  Excercise 2
function reverseArray (arr) {
    newArr = [];
    for (let i = arr.length - 1; i >= 0; i -= 1) {
        newArr.push(arr[i])
    } 
    return newArr;
}

let lst = [1, 2, 3, 4, 5]

function reverseArrayInPlace(arr) {
    copyArr = arr.slice();
    arr.splice(0, arr.length)
    for (let i = copyArr.length - 1; i >= 0; i -= 1) {
        arr.push(copyArr[i])
    }
    return arr
}

// Excercise 3
function arrayToList(arr) {
    if (arr.length == 1) {
        let list = {
            value: arr[0],
            rest: null
        }
        return list
    } else {
        let list = {
            value: arr[0],
            rest: arrayToList(arr.slice(1))
        }
        return list
    }
}

function listToArray(list) {
    arr = [];
    for (let node = list; node; node = node.rest) {
        arr.push(node.value)
    }
    return arr
}

function prepend(element, list) {
    newList = {
        value: element,
        rest: list
    }
    return newList
}

function nth(n, list) {
    let value = null;
    for (let node = list; n > 0; node = node.rest) {
        value = node.value
        n -= 1
    }
    return value
}


// Excercise 4

function deepEquals(a, b) {
    if (typeof a != "object" && typeof b != "object") {
        return a == b
    } else if (a === null || b === null) {
        return a == b
    } else {
        let equalFlag = true
        let checkCount = 0
        if (Object.keys(a).length != Object.keys(b).length) {
            return false
        }
        for (let keyA of Object.keys(a)) {
            for (let keyB of Object.keys(b)) {
                if (keyA == keyB) {
                    checkCount += 1
                    if (!deepEquals(a[keyA], b[keyB])) {
                        return false
                    }

                }
            }
        }
        if (checkCount != Object.keys(a).length) {
            return false
        }
        return equalFlag
    }
}