const { readdir, readFile, writeFile } = require('fs/promises');
const { join, extname } = require('path');

buildBundle();

async function buildBundle(){

  const sourceDirPath = join(__dirname, 'styles');

  try{
    const files = await readdir(sourceDirPath, {withFileTypes: true});
    let cssArr = [];

    for (let file of files){
      const currentSourceFile = join(sourceDirPath, file.name);
      const ext = extname(currentSourceFile);

      if(ext === '.css' && file.isFile()){

        try{
          const fileContents = await readFile(currentSourceFile);
          cssArr.push(fileContents);
        } catch(err) {
          console.log(err);
        }
      }
    }

    await writeFile(join(__dirname, '/project-dist', 'bundle.css'), cssArr);

  } catch(err){
    console.log(err);
  }

}
