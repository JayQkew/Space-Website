import { getPlanetData } from "./planet-data.js";

const planetData = await getPlanetData();

const SUNRADIUS = 100;
let extentRadius = getExtent('meanRadius'),
    extentDistance = getExtent('semimajorAxis');

let RADIUS = window.innerWidth,
    MARGIN = 50;

let svg;

/**
 * gets extent of the specific data in the array of objects
 * @param {string} property the data that the array should be sorted by
 * @returns extents of the array
 */
function getExtent(property){
    [...planetData].sort((a,b) => a[property] - b[property]);
    return d3.extent(planetData, d => d[property]);   
}

/**
 * creates the data viz of the universe
 */
function renderSolarSystem(){
    // creates the svg where the data vis will be
    svg = d3.select('.solar-system')
    .attr('height', RADIUS * 2.5)
    .attr('width', RADIUS)
    .attr('transform', `translate(0,${-RADIUS/1.75})`)
    .append('g')
    .attr('class', 'ss-inner')
    .attr('height', RADIUS*2)
    .attr('width', RADIUS)
    .attr('transform', `translate(${MARGIN/2},${RADIUS})`);

    // create the planet rings
    svg.selectAll('circle')
    .data(planetData)
    .enter()
    .append('circle')
    .attr('class', 'semimajorAxis')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', d => dScale(d.semimajorAxis));
}

// distance scale
const dScale = d3.scaleLinear()
.domain([extentDistance[0], extentDistance[1]])
.range([SUNRADIUS, RADIUS-MARGIN]);

// radius scale
const rScale = d3.scaleLinear()
.domain([extentRadius[0], extentRadius[1]])
.range([3, 35]);

// angle scale
const aScale = d3.scaleLinear()
.domain([extentDistance[0], extentDistance[1]])
.range([4, 3.75]);
