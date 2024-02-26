// setTimeout(() => console.log("Tick"), 3000);

// Youtube Practice: https://www.youtube.com/watch?v=DHvZLI7Db8E

let p = new Promise((resolve, reject) => {
    let a = 1 + 1
    if (a == 2) {
        resolve("Success")
    } else {
        reject("Failed")
    }
})

p.then((message) => {
    console.log("This is in the then " + message)
}).then(() => {
    console.log("This prevents another callback.")
}).then(() => {
    console.log("We can just keep adding messages.")
}).catch((message) => {
    console.log("This is in the catch " + message)
})



