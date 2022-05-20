async function copyDir(){
  const { readdir, mkdir, copyFile , rm } = require('fs/promises');
  const { join } = require('path');

  const oldDirPath = join(__dirname, 'files');
  const newDirPath = join(__dirname, 'files-copy');

  await rm(newDirPath, { recursive: true, force: true });

  mkdir(newDirPath, {recursive: true});

  try{
    const files = await readdir(oldDirPath);

    for (const file of files){
      const oldFile = join(oldDirPath, file);
      const newFile = join(newDirPath, file);
      await copyFile(oldFile, newFile);
    }

  } catch (err){
    console.log(err);
  }

}

copyDir();
