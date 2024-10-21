import { getPlanetData } from "./planet-data.js";

const planetData = await getPlanetData();

let extentRadius = getExtent('meanRadius'),
    extentDistance = getExtent('semimajorAxis');

/**
 * gets extent of the specific data in the array of objects
 * @param {string} property the data that the array should be sorted by
 * @returns extents of the array
 */
function getExtent(property){
    [...planetData].sort((a,b) => a[property] - b[property]);
    return d3.extent(planetData, d => d[property]);   
}

console.log(extentRadius);
console.log(extentDistance);