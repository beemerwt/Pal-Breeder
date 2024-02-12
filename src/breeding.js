// Things we want
// 1. Search final breed result based on two parents (so we can calculate from passives) - Two Parent Search
// 2. Search final breed result based on a single parent - One Parent Search
// 3. Search most powerful result from a large set of existing pals - Optimal Search

// 4. Search most likely passives from existing pals to result ID - Specific Search
//  Upload Save, Load Pals
//  Want to choose result Pal and the passive traits we want
//  Then the algorithm will sort through the saved pals to find the traits
//      Use those pals to come up with a route to the desired pal

// Test breed path from one parent:
// Fuack cannot produce a Vixy.
// Fuack CAN produce a Foxparks, which CAN produce a Vixy
import { onPageLoaded } from "./loader";
import pals from "./palstats";
import pairs from "./breedpairs";

let obtainedPals = [];
const uniqueCombos = [
  "Chikipi",
  "Frostallion",
  "Jetragon",
  "Paladius",
  "Necromus",
  "Jormuntide Ignis",
]

/**
 * 
 * @param {number} id The id of the pal
 * @param {boolean} variant Is this the variant type?
 * @returns {any | undefined}
 */
function getPalById(id, variant = undefined) {
  return pals.find(pal => pal.id === id
    && (variant ? pal?.variant : true));
}

/**
 * Gets a list of pals currently owned in the savefile filtered by traits
 * @param {Array | null} traits The traits to filter by
 * @returns 
 */
function getSavedPals(traits = null) {
  if (!traits || obtainedPals.length <= 0 || !traits.length || traits.length <= 0)
    return obtainedPals;

  return obtainedPals.filter(pal => {
    if (!pal.PassiveSkillList)
      return false;

    for (let i of traits)
      if (pal.PassiveSkillList.includes(i))
        return true;

    return false;
  })
}

function getPairsToResultFromName(currentName, resultName) {
  const pairNames = [];
  for (let [ mate, pairMap ] of Object.entries(pairs)) {
    for (let [ pairMate, result ] of Object.entries(pairMap)) {
      if (pairMate === currentName && result === resultName)
        pairNames.push(mate);
    }
  }

  return pairNames;
}

function findResultFromName(currentName, resultName) {
  // if it's directly bred into, return with the mate
  for (let [mate, result] of Object.entries(pairs[currentName])) {
    if (result === resultName) {
      return [{ mate, result }];
    }
  }

  for (let [firstMate, firstResult] of Object.entries(pairs[currentName])) {
    for (let [secondMate, secondResult] of Object.entries(pairs[firstResult])) {
      if (secondResult === resultName) {
        return [
          { mate: firstMate, result: firstResult },
          { mate: secondMate, result: secondResult }
        ];
      }

      for (let [thirdMate, thirdResult] of Object.entries(pairs[secondResult])) {
        if (thirdResult === resultName) {
          return [
            { mate: firstMate, result: firstResult },
            { mate: secondMate, result: secondResult },
            { mate: thirdMate, result: thirdResult }
          ];
        }

        for (let [fourthMate, fourthResult] of Object.entries(pairs[thirdResult])) {
          if (fourthResult === resultName) {
            return [
              { mate: firstMate, result: firstResult },
              { mate: secondMate, result: secondResult },
              { mate: thirdMate, result: thirdResult },
              { mate: fourthMate, result: fourthResult }
            ];
          }
        }
      }
    }
  }

  return undefined;
}

onPageLoaded(() => {
  const savedata = localStorage.getItem("pals");
  if (savedata !== null)
    obtainedPals = JSON.parse(savedata);

  console.log(obtainedPals);  
});

export default {
  getSavedPals,
  getPalById,
  findResultFromName,
  getUniqueCombos() { return uniqueCombos; }
}