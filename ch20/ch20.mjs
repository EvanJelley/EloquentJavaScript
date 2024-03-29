import { reverse } from './reverse.mjs';
import { createWriteStream, readFile, writeFile } from 'node:fs';
import { join } from 'node:path';
import { createServer, request } from 'node:http';

// readFile('/Users/evanjelley/Documents/CS/EloquentJavaScript/ch20/file.txt',
//     "utf8", (error, text) => {
//         if (error) throw error;
//         console.log(text);
//     });
//

// writeFile('/Users/evanjelley/Documents/CS/EloquentJavaScript/ch20/file.txt',
//     "I am writing new text to this file",
//     (err) => {
//         if (err) throw err;
//         console.log('File written');
//     });

// let txtFileStream = createWriteStream('/Users/evanjelley/Documents/CS/EloquentJavaScript/ch20/file.txt', { flags: 'a' });
// txtFileStream.write('I am writing new text to this file\n');

// createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     request.on('data', chunk => 
//     response.write(chunk.toString().toUpperCase()));
//     request.on('end', () => response.end());
// }).listen(8000);
// console.log('Server running on port 8000');

