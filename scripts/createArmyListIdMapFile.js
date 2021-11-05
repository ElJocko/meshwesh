'use strict';

const fs = require('fs').promises;

async function readData() {
  // Get a list of the files in the directory
  const dirPath = './temp';
  const files = await fs.readdir(dirPath);

  // Extract the data and write to the output file
  let armyListCount = 0;
  const outputPath = './armyListIdMap.csv';
  for (const filename of files) {
    const filePath = dirPath + '/' + filename;
    const fileData = await fs.readFile(filePath);

    try {
      const armyList = JSON.parse(fileData);
      if (armyList.listId && armyList.sublistId && armyList.id) {
        console.log(armyList.id);
        armyListCount += 1;

        const line = `${ armyList.listId }, ${ armyList.sublistId }, ${ armyList.id }\n`;
        fs.appendFile(outputPath, line);
      }
    }
    catch(err) {
      console.warn(`Unable to parse contents of file ${ filename }`);
    }
  }

  console.log(`Found ${ armyListCount } army lists with ids.`);
}

readData();
