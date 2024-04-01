import { readFileSync, statSync, readdirSync  } from 'fs';

let regEx = RegExp(process.argv[2]);

for (let i = 3; i < process.argv.length; i++) {
    let arg = process.argv[i];
    if (statSync(arg).isDirectory()) {
        exploreDirectory(arg);
    } else {
        if (regEx.test(readFileSync(arg, 'utf8'))) {
            console.log(arg);
        };
    };
};

function exploreDirectory(dir) {
    for (let file of readdirSync(dir)) {
        filePath = join(dir, file);
        if (statSync(filePath).isDirectory()) {
            exploreDirectory(file);
        } else {
            if (regEx.test(readFileSync(file, 'utf8'))) {
                console.log(file);
            }
        }
    }
};