const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

function buildGraph(edges) {
    let graph = Object.create(null);
    function addEdge(from, to) {
        if (graph[from] == null) {
            graph[from] = [to];
        } else {
            graph[from].push(to);
        }
    }
    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;
                return { place: destination, address: p.address };
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

function runRobot(state, robot, memory) {
    for (let turn = 0; ; turn++) {
        if (state.parcels.length == 0) {
            return turn;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
    }
}

function runTalkativeRobot(state, robot, memory) {
    for (let turn = 0; ; turn++) {
        if (state.parcels.length == 0) {
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

// Random robot
function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.place]) };
}

VillageState.random = function (parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({ place, address });
    }
    return new VillageState("Post Office", parcels);
};

// runRobot(VillageState.random(), randomRobot);

// Route robot
const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute;
    }
    return { direction: memory[0], memory: memory.slice(1) };
}

// runRobot(VillageState.random(), routeRobot, []);

// Route finding robot
function findRoute(graph, from, to) {
    let work = [{ at: from, route: [] }];
    for (let i = 0; i < work.length; i++) {
        let { at, route } = work[i];
        for (let place of graph[at]) {
            if (place == to) return route.concat(place);
            if (!work.some(w => w.at == place)) {
                work.push({ at: place, route: route.concat(place) });
            }
        }
    }
}

function goalOrientedRobot({ place, parcels }, route) {
    if (route.length == 0) {
        let parcel = parcels[0];
        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
        } else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    }
    return { direction: route[0], memory: route.slice(1) };
}

// runTalkativeRobot(VillageState.random(), goalOrientedRobot, [])

// Parcel picker - Exercise 2
function closestParcel(graph, from, places) {
    let shortestRoute = null
    for (let place of places) {
        route = findRoute(graph, from, place)
        if (shortestRoute == null || route.length < shortestRoute.length) {
            shortestRoute = route
        }
    }
    return shortestRoute
}

function parcelPickerRobot({ place, parcels }, route) {
    if (route == 0) {
        let locations = []
        for (p of parcels) {
            if (p.place == place) {
                locations.push(p.address)
            } else {
                locations.push(p.place)
            }
        route = closestParcel(roadGraph, place, locations)
        }
    }
    return { direction: route[0], memory: route.slice(1)}
}

// runTalkativeRobot(VillageState.random(), parcelPickerRobot, [])

// Comparison Function - Exercise 1
function compareRobots(robot1, memory1, robot2, memory2, tests = 100) {
    let totSteps1 = 0
    let totSteps2 = 0
    for (i = 0; i < tests; i++) {
        let state = VillageState.random()
        totSteps1 += runRobot(state, robot1, memory1)
        totSteps2 += runRobot(state, robot2, memory2)
    }
    console.log(`Robot1 average steps to complete: ${totSteps1 / tests}\n Robot2 average steps to complete: ${totSteps2 / tests}`)
}


// compareRobots(routeRobot, [], parcelPickerRobot, [], 10000)

// Exercise 3
class PGroup {
    constructor(array) {
        this.items = array
    }
    add(item) {
        if (!this.items.includes(item)) {
            let newItems = [...this.items]
            newItems.push(item)
            return new PGroup(newItems)
        }
    }
    delete(item) {
        let index = this.items.indexOf(item)
        if (index > -1) {
            let newItems = [...this.items]
            newItems.splice(index, 1)
            return new PGroup(newItems)
        }
    }
    has(item) {
        if (this.items.includes(item)) {
            return true
        } else {
            return false
        }
    }
}

PGroup.empty = new PGroup([])

let a = PGroup.empty.add("a")
let ab = a.add("b")
let b = ab.delete("a")
console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false

