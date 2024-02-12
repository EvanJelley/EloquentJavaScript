function countToTenEvenWhile() {
    let number = 0;
    while (number <= 10) {
    console.log(number);
    number += 2;
}
}

function counttoTenEvenFor() {
    for (let number = 0; number <= 10; number += 2) {
        console.log(number);
    }
}

function findTwoToPowerOfTenWhile() {
    let result = 1;
    let counter = 0;
    while (counter < 10) {
        result *= 2;
        counter++;
    };
    console.log(result);
}

function findTwoToPowerOfTenFor() {
    let result = 1;
    for (let counter = 0; counter < 10; counter++) {
        result *= 2;
    }
    console.log(result);
}

function findNumber() {
    for (let num = 20; ; num += 1) {
        if (num % 7 === 0) {
            console.log(num);
            break;
        }
    }
}

function  howIsTheWeather(weather) {
    switch (weather) {
        case "rainy":
            console.log("Remember to bring an umbrella.");
            break;
        case "sunny":
            console.log("Dress lightly.");
        case "cloudy":
            console.log("Go outside.");
            break;
        default:
            console.log("Unknown weather type!");
            break;
    }
}

// Excercise 2.1
function printHashes(lines) {
    for (let count = 0; count < lines; count++) {
        console.log("#".repeat(count + 1));
    }
}

// Excercise 2.2
function fizzBuzz() {
    for (let num = 1; num <= 100; num++) {
        if (num % 3 === 0 && num % 5 === 0) {
            console.log("FizzBuzz");
        } else if (num % 3 === 0) {
            console.log("Fizz");
        } else if (num % 5 === 0) {
            console.log("Buzz");
        } else {
            console.log(num);
        }
    }
}

// Excercise 2.3
function chessBoard(size) {
    let text="";
    for (let row = 1; row <= size; row++) {
        for (let col = 1; col <= size; col++) {
            if (row % 2 === 0) {
                if (col % 2 === 0) {
                    text += " ";
                } else {
                    text += "#"
                }
            } else {
                if (col % 2 === 0) {
                    text += "#";
                } else {
                    text += " ";
                }
            }
        }
        text += "\n";
    }
    console.log(text);
}
