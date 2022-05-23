const { createWriteStream } = require('fs');
const { join } = require('path');
const { stdout, stdin } = process;

const output = createWriteStream(join(__dirname, 'txt-from-console.txt'));

stdout.write('Please type some text here: ');

stdin.on('data', data => {
  if(data.toString().trim() === 'exit'){
    process.exit();
  }

  output.write(data);
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => console.log('Thank you, goodbye!'));