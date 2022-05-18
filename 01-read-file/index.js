const fs = require('fs');
const path = require('path');
const { stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');

const newReadStream = fs.createReadStream(pathToFile);
newReadStream.on('data', chunk => stdout.write(chunk));