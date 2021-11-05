'use strict';

const fs = require('fs').promises;
const Papa = require('papaparse');

const ArmyListIdMap = require('../app/models/armyListIdMapModel');

async function importArmyListIdMap() {
  // Establish the database connection
  console.log('Setting up the database connection');
  await require('../app/lib/dbConnection').initializeConnection();

  // Read the file with the map data
  const inputFilePath = './armyListIdMap.csv';
  const inputData = await fs.readFile(inputFilePath, { encoding: "utf-8" });

  Papa.parse(
    inputData,
    {
      delimiter: ',',
      header: false,
      skipEmptyLines: true,
      complete: async function(results) {
        console.log(`Read ${ results.data.length } rows from input file`);

        for (const row of results.data) {
          const armyListData = {
            listId: row[0].trim(),
            sublistId: row[1].trim(),
            databaseId: row[2].trim()
          };

          console.log(`listId: ${ armyListData.listId }, sublistId: ${ armyListData.sublistId }, databaseId: ${ armyListData.databaseId }`);

          // Write the map data to the database
          const document = new ArmyListIdMap(armyListData);
          await document.save();
        }
      }
    });
}

importArmyListIdMap();
