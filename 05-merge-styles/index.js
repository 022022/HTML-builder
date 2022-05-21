const { readdir } = require('fs/promises');
const { join, extname } = require('path');

const { createWriteStream, createReadStream } = require('fs');

buildBundle();

async function buildBundle(){

  const sourceDirPath = join(__dirname, 'styles');
  const destDirPath = join(__dirname, '/project-dist', 'bundle.css');
  const output = createWriteStream(destDirPath);

  try{
    const files = await readdir(sourceDirPath, {withFileTypes: true});

    for (let file of files){
      const currentSourceFile = join(sourceDirPath, file.name);
      const ext = extname(currentSourceFile);

      if(ext === '.css' && file.isFile()){

        const input = createReadStream(currentSourceFile);
        input.pipe(output);
      }
    }

  } catch(err){
    console.log(err);
  }

}
