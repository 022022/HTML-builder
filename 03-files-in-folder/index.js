const { readdir, stat } = require('fs/promises');
const { extname, join, basename } = require('path');
const { stdout } = process;

const sourceDir = join(__dirname, '/secret-folder');

getDir();

async function getDir(){
  try {
    const items = await readdir(sourceDir, {withFileTypes: true});
    for (const item of items){
      if(item.isFile()){
        getFileStats(item);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function getFileStats(file){
  const currentPath = join(sourceDir, file.name);

  const extension = extname(currentPath);
  const name = basename(currentPath, extension);

  try {
    const stats = await stat(currentPath);
    showFileStats(name, extension, stats.size);
  } catch (err) {
    console.error(err);
  }
}

function showFileStats(name, extension, size){
  stdout.write(`${ name } - ${ extension.slice(1) } - ${ (size/1024).toFixed(3) }kb  \n`);
}
