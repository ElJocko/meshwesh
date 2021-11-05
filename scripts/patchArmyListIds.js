'use strict';

const ArmyListIdMap = require('../app/models/armyListIdMapModel');
const ArmyList = require('../app/models/armyListModel');
const AllyArmyList = require('../app/models/allyArmyListModel');
const EnemyXref = require('../app/models/enemyXrefModel');
const ThematicCategoryToArmyListXref = require('../app/models/thematicCategoryToArmyListXrefModel');

async function patchArmyListIds() {
  // Establish the database connection
  console.log('Setting up the database connection');
  await require('../app/lib/dbConnection').initializeConnection();

  const armyListIds = await ArmyListIdMap.find({});
  console.log(`Found ${ armyListIds.length } army lists in the map`);

  let updateCount = 0;

  for (const armyListId of armyListIds) {
    const query = { listId: armyListId.listId.trim(), sublistId: armyListId.sublistId.trim() };
    const armyList = await ArmyList
      .findOne(query)
      .lean();
    if (armyList) {
      const oldId = armyList._id;
      const newId = armyListId.databaseId.trim();

      if (oldId.toString() !== newId ) {
        armyList._id = newId;
        const newArmyList = new ArmyList(armyList);
        try {
          // Save the army list with the new id
          await newArmyList.save();

          // Delete the old army list
          await ArmyList.findOneAndDelete({ _id: oldId });

          // Update the ally army lists to match
          const allyArmyLists = await AllyArmyList.find({ armyListId: oldId });
          for (const allyArmyList of allyArmyLists) {
            allyArmyList.armyListId = newId;
            await allyArmyList.save();
          }

          // Update the enemy xrefs to match
          const oldIdString = oldId.toString();
          const enemyXrefs1 = await EnemyXref.find({ armyList1: oldId });
          for (const enemyXref of enemyXrefs1) {
            enemyXref.armyList1 = newId;
            await enemyXref.save();
          }

          const enemyXrefs2 = await EnemyXref.find({ armyList2: oldId });
          for (const enemyXref of enemyXrefs2) {
            enemyXref.armyList2 = newId;
            await enemyXref.save();
          }

          // Update the thematic category xrefs to match
          const thematicCategoryXrefs = await ThematicCategoryToArmyListXref.find({ armyList: oldId });
          for (const thematicCategoryXref of thematicCategoryXrefs) {
            thematicCategoryXref.armyList = newId;
            await thematicCategoryXref.save();
          }
//          console.log(`${ armyList.name } updated`);
          updateCount += 1;
        }
        catch(err) {
          console.warn(err);
        }
      }
      else {
        try {

        }
        catch(err) {
          console.warn(err);
        }
      }
    }
    else {
      console.log(`Could not find army list for ${ armyListId.listId.trim() }, ${ armyListId.sublistId.trim() }`);
    }
  }

  console.log(`Updated ${ updateCount } army lists`);
}

patchArmyListIds();
