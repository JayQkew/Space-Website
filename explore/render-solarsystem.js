import { getPlanetData } from "./planet-data.js";
import { planetBasket } from "./planet-basket.js";

const planetData = await getPlanetData();

const SUNRADIUS = 100;
let extentRadius = getRadiusExtent(),
    extentDistance = getDistanceExtent();

let RADIUS = window.innerWidth,
    MARGIN = 50;

let svg;
let planets;
let planetTexts;

/**
 * gets the extents of the distance from the sun
 * @returns extent of planetData's semimajorAxis
 */
function getDistanceExtent(){
    [...planetData].sort((a,b) => a.semimajorAxis - b.semimajorAxis);
    return d3.extent(planetData, d => d.semimajorAxis);   
}

/**
 * gets the extents of the planets radius excluding the sun
 * @returns extent of planetData's radius
 */
function getRadiusExtent(){
    let sortedPlanets = [...planetData].sort((a,b) => a.meanRadius - b.meanRadius);
    let minRadius = d3.min(sortedPlanets, d => d.meanRadius);
    let maxRadius = sortedPlanets[sortedPlanets.length-2].meanRadius;
    return [minRadius, maxRadius];
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

    //create the planets
    planets = svg.selectAll('circle.planet')
    .data(planetData)
    .enter()
    .append('circle')
    .attr('class', d => d.englishName.toLowerCase() + ' planet')
    .attr('cx', d => {
        return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis)*Math.PI/2);
    })
    .attr('cy', d => {
        return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis)*Math.PI/2);
    })
    .attr('r', d => {
        return (d.englishName === 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
    });

    console.log(planets);
    addPlanetEvents();

    planetTexts = svg.selectAll('text.planet')
    .data(planetData)
    .enter()
    .append('text')
    .attr('class', d => `${d.englishName.toLowerCase()}-label planet-label`)
    .attr('x', d => {
        return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis) * Math.PI / 2);
    })
    .attr('y', d => {
        let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis) * Math.PI / 2);
        let r = (d.englishName == 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
        return yPos - r - 15;
    })
    .text(d => d.englishName);
}

/**
 * adds all mouse events to the planets
 */
function addPlanetEvents(){
    planets.each(p =>{
        const planet = document.querySelector(`.${p.englishName.toLowerCase()}`)

        // add/remove the planet to/from the planetBasket
        planet.addEventListener('click', () =>{
            if (!planetBasket.includes(p)) planetBasket.push(p);
            else planetBasket.splice(planetBasket.indexOf(p), 1);
        });

        // display the planet name when hovering over planet
        planet.addEventListener('mouseover', () =>{
            d3.select(`.${p.englishName.toLowerCase()}-label`)
            .style('display', () =>{
                return (window.scrollY / RADIUS*2 < 1) ? 'block' : 'none';
            });
        });

        // make the name disapear when hovering off planet
        planet.addEventListener('mouseout', () =>{
            d3.select(`.${p.englishName.toLowerCase()}-label`)
            .style('display', 'none');
        })
    })
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

renderSolarSystem();