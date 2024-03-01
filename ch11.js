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

// p.then((message) => {
//     console.log("This is in the then " + message)
// }).then(() => {
//     console.log("This prevents another callback.")
// }).then(() => {
//     console.log("We can just keep adding messages.")
// }).catch((message) => {
//     console.log("This is in the catch " + message)
// })


// Begin Eloquent JavaScript Work

var bigOak = require("./crow-tech").bigOak;

// bigOak.readStorage("food caches", caches => {
//   let firstCache = caches[0];
//   bigOak.readStorage(firstCache, info => {
//     console.log(info);
//   });
// });

var defineRequestType = require("./crow-tech.js").defineRequestType;

defineRequestType("note", (nest, content, source, done) => {
    console.log(`${nest.name} received note: ${content}`);
    done();
});


// bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM",
//             () => console.log("Done"));

function storage(nest, name) {
    return new Promise(resolve => {
        nest.readStorage(name, result => resolve(result));
    });
}

// storage(bigOak, "enemies").then(value => console.log("Got", value));

var Timeout = class Timeout extends Error { }

function request(nest, target, type, content) {
    return new Promise((resolve, reject) => {
        let done = false;
        function attempt(n) {
            nest.send(target, type, content, (failed, value) => {
                done = true;
                if (failed) reject(failed);
                else resolve(value);
            });
            setTimeout(() => {
                if (done) return;
                else if (n < 3) attempt(n + 1);
                else reject(new Timeout("Timed out"));
            }, 250);
        }
        attempt(1);
    });
}

function requestType(name, handler) {
    defineRequestType(name, (nest, content, source,
        callback) => {
        try {
            Promise.resolve(handler(nest, content, source))
                .then(response => callback(null, response),
                    failure => callback(failure));
        } catch (exception) {
            callback(exception);
        }
    });
}

requestType("ping", () => "pong");

function availableNeighbors(nest) {
    let requests = nest.neighbors.map(neighbor => {
        return request(nest, neighbor, "ping")
            .then(() => true, () => false);
    });
    return Promise.all(requests).then(result => {
        return nest.neighbors.filter((_, i) => result[i]);
    });
}

// availableNeighbors(bigOak).then(console.log);

var everywhere = require("./crow-tech.js").everywhere;

everywhere(nest => {
    nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
    nest.state.gossip.push(message);
    for (let neighbor of nest.neighbors) {
        if (neighbor == exceptFor) continue;
        request(nest, neighbor, "gossip", message);
    }
}

requestType("gossip", (nest, message, source) => {
    if (nest.state.gossip.includes(message)) return;
    console.log(`${nest.name} received gossip '${message}' from ${source}`);
    sendGossip(nest, message, source);
});

// sendGossip(bigOak, "Kids with airgun in the park");

requestType("connections", (nest, { name, neighbors },
    source) => {
    let connections = nest.state.connections;
    if (JSON.stringify(connections.get(name)) ==
        JSON.stringify(neighbors)) return;
    connections.set(name, neighbors);
    broadcastConnections(nest, name, source);
});

function broadcastConnections(nest, name, exceptFor = null) {
    for (let neighbor of nest.neighbors) {
        if (neighbor == exceptFor) continue;
        request(nest, neighbor, "connections", {
            name,
            neighbors: nest.state.connections.get(name)
        });
    }
}

everywhere(nest => {
    nest.state.connections = new Map();
    nest.state.connections.set(nest.name, nest.neighbors);
    broadcastConnections(nest, nest.name);
});

// console.log(bigOak.state.connections);

function findRoute(from, to, connections) {
    let work = [{ at: from, via: null }];
    for (let i = 0; i < work.length; i++) {
        let { at, via } = work[i];
        for (let next of connections.get(at) || []) {
            if (next == to) return via;
            if (!work.some(w => w.at == next)) {
                work.push({ at: next, via: via || next });
            }
        }
    }
    return null;
}

function routeRequest(nest, target, type, content) {
    if (nest.neighbors.includes(target)) {
        return request(nest, target, type, content);
    } else {
        let via = findRoute(nest.name, target,
            nest.state.connections);
        if (!via) throw new Error(`No route to ${target}`);
        return request(nest, via, "route",
            { target, type, content });
    }
}

requestType("route", (nest, { target, type, content }) => {
    return routeRequest(nest, target, type, content);
});

requestType("storage", (nest, name) => storage(nest, name));

function findInStorage(nest, name) {
    return storage(nest, name).then(found => {
        if (found != null) return found;
        else return findInRemoteStorage(nest, name);
    });
}

function network(nest) {
    return Array.from(nest.state.connections.keys());
}

function findInRemoteStorage(nest, name) {
    let sources = network(nest).filter(n => n != nest.name);
    function next() {
        if (sources.length == 0) {
            return Promise.reject(new Error("Not found"));
        } else {
            let source = sources[Math.floor(Math.random() *
                sources.length)];
            sources = sources.filter(n => n != source);
            return routeRequest(nest, source, "storage", name)
                .then(value => value != null ? value : next(),
                    next);
        }
    }
    return next();
}

var Group = class Group {
    constructor() { this.members = []; }
    add(m) { this.members.add(m); }
}

function anyStorage(nest, source, name) {
    if (source == nest.name) return storage(nest, name);
    else return routeRequest(nest, source, "storage", name);
}

async function chicks(nest, year) {
    let list = "";
    await Promise.all(network(nest).map(async name => {
        list += `${name}: ${await anyStorage(nest, name, `chicks in ${year}`)
            }\n`;
    }));
    return list;
}


// Exercise 1
async function locateScalpel(nest) {
    let searching = nest.neighbors[0];
    while (true) {
        console.log(`Searching in ${searching}`)
        let result = await anyStorage(nest, searching, 'scalpel');
        if (result == searching) return result;
        else searching = result;
    }
}

function locateScalpel2(nest) {
    function loop(current) {
        return anyStorage(nest, current, "scalpel").then(next => {
            if (next == current) return current;
            else return loop(next)
        })
    }
    return loop(nest.name)
}


// Exercise 2
function Promise_all(promises) {
    return new Promise((resolve, reject) => {
        let results = [];
        let pending = promises.length;
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(result => {
                results[i] = result;
                pending--;
                if (pending == 0) resolve(results);
            }).catch(reject);
        }
        if (promises.length == 0) resolve(results);
    });
}

// Test code.
Promise_all([]).then(array => {
    console.log("This should be []:", array);
});

function soon(val) {
    return new Promise(resolve => {
        setTimeout(() => resolve(val), Math.random() * 500);
    });
}

Promise_all([soon(1), soon(2), soon(3)]).then(array => {
    console.log("This should be [1, 2, 3]:", array);
});

Promise_all([soon(1), Promise.reject("X"), soon(3)])
    .then(array => {
        console.log("We should not get here");
    })
    .catch(error => {
        if (error != "X") {
            console.log("Unexpected failure:", error);
        }
    });


