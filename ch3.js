/* Functions */

const square = function(x) {
    return x * x;
}

const power = function(base, exponent) {
    let result = 1;
    for (let count =0; count < exponent; count++) {
        result *= base;
    }
    return result;
}

// Declaring functions after they are called (Uncomment the following line to see what happens.)

// console.log("The future says:", future());

function future() {
    return "You'll never have flying cars";
}

// Arrow functions

const square1 = (x) => {return x * x;};
const square2 = x => x * x;

const horn = () => console.log("Toot");

// Optional arguments

function minus(a, b) {
    if (b === undefined) return -a;
    else return a - b;
}

// Closure

function wrapValue(n) {
    let local = n;
    return () => local;
}

let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);

function multiplier(factor) {
    return number => number * factor;
}

twice = multiplier(2);
thrice = multiplier(3);

// Recursion

function powerRecurssively(base, exponent) {
    if (exponent === 0) {
        return 1;
    } else {
        return base * powerRecurssively(base, exponent - 1);
    }
}

function findSolution(target) {
    function find(current, history) {
        if (current === target) {
            return history;
        } else if (current > target) {
            console.log("Current is greater than target", history);
            return null;
        } else {
            return find(current + 5, `(${history} + 5)`) ||
                    find(current * 3, `(${history} * 3)`)
        }
    }
    return find(1, "1");
}

// Growing functions

function printFarmInventory(cows, chickens) {
    let cowString = String(cows);
    while (cowString.length < 3) {
        cowString = "0" + cowString; 
    }
    console.log(`${cowString} Cows`);
    let chickenString = String(chickens); 
    while (chickenString.length < 3) {
        chickenString = "0" + chickenString; 
    }
    console.log(`${chickenString} Chickens`); 
} 

function zeroPad (number, width) {
    let numberString = String(number);
    while (numberString.length < 3) {
        numberString = "0" + numberString;
    }
    return numberString;
}

function printFarmInventory(cows, chickens, pigs) {
    console.log(`${zeroPad(cows, 3)} Cows`);
    console.log(`${zeroPad(chickens, 3)} Chickens`);
    console.log(`${zeroPad(pigs, 3)} Pigs`);
}

// Excercise 3.1

function min(a, b) {
    if (a < b) return a;
    else return b;
}

// Excercise 3.2
function isEvenRecursive(n) {
    if (n < 0) return isEvenRecursive(-n);
    else if (n === 0) return true;
    else if (n === 1) return false;
    else return isEvenRecursive(n - 2);
}

// Excercise 3.3

function countChar(string, char) {
    let count = 0;
    for (let i = 0; i < string.length; i++){
        if (string[i] === char) count++;
    }
    return count;
}
