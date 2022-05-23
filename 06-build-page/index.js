const { readdir, mkdir, readFile, writeFile, rm } = require('fs/promises');
const { join, extname, basename } = require('path');
const { createWriteStream, createReadStream } = require('fs');

buildPage();


async function buildPage(){
  const sourceDirPath = join(__dirname);
  const resultDirPath = join(__dirname, 'project-dist');

  await rm(resultDirPath, { recursive: true, force: true });
  await mkdir(resultDirPath, { recursive: true });

  buildBundle('styles', 'style.css');
  copyDir(join(sourceDirPath, 'assets'), resultDirPath, 'assets');
  fillTemplates('template.html', 'components', 'project-dist/index.html');
}

async function fillTemplates(templateFile, templateDir, destinationFilePath){

  const templateDirPath = join(__dirname, templateDir);

  try{
    const templateFileContents = await readFile(join(__dirname, templateFile));
    let templateFileContentsStr = templateFileContents.toString();

    try{
      const filesToFit = await readdir(templateDirPath);

      for(const file of filesToFit){
        const filePath = join(templateDirPath, file);
        const extension = extname(filePath);
        const name = basename(filePath, extension);
        const templateCode = `{{${name}}}`;


        if (templateFileContentsStr.includes(templateCode)){

          try{
            const fileToFitContents = await readFile(filePath);
            const fileToFitContentsStr = fileToFitContents.toString();
            templateFileContentsStr = templateFileContentsStr.replace(templateCode, fileToFitContentsStr);
          }
          catch(err){console.log(err);}
        }
      }

      await writeFile(join(__dirname, destinationFilePath), templateFileContentsStr);

    }
    catch(err){console.log(err);}

  }
  catch(err){console.log(err);}

}


async function buildBundle(sourceDir, bundleName){

  const sourceDirPath = join(__dirname, sourceDir);

  try{
    const files = await readdir(sourceDirPath, {withFileTypes: true});
    let cssArr = [];

    for (const file of files){
      const currentSourceFile = join(sourceDirPath, file.name);
      const ext = extname(currentSourceFile);

      if(ext === '.css' && file.isFile()){

        try{
          const fileContents = await readFile(currentSourceFile);
          cssArr.push(fileContents);
        } catch(err) {console.log(err);}
      }
    }

    cssArr.reverse();
    await writeFile(join(__dirname, '/project-dist', bundleName), cssArr);

  } catch(err){console.log(err);}
}



async function copyDir(from , to, newFolderName){
  const newDir = join(to, newFolderName);
  mkdir(newDir, {recursive: true});

  try{
    const files = await readdir(from, {withFileTypes: true});

    for (const file of files){
      if(file.isDirectory()){
        const oldInnerDir = join(from, file.name);
        await copyDir(oldInnerDir, newDir, file.name);

      }
      if(file.isFile()){
        const oldFile = join(from, file.name);
        const newFile = join(newDir, file.name);

        const input = createReadStream(oldFile);
        input.on('error', (err) => console.log(err));

        const output = createWriteStream(newFile);
        output.on('error', (err) => console.log(err));

        input.pipe(output);
      }
    }

  } catch (err){console.log(err);}
}