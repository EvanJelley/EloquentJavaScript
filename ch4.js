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

for (let event of journalEvents(JOURNAL)) {
    if (phi(tableFor(event, JOURNAL)) > 0.1 || phi(tableFor(event, JOURNAL)) < -0.1) {
        console.log(event + ":", phi(tableFor(event, JOURNAL)));
    }
}