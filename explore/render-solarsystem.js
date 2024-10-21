import { getPlanetData } from "./planet-data.js";

const planetData = await getPlanetData();

const SUNRADIUS = 100;
let extentRadius = getExtent('meanRadius'),
    extentDistance = getExtent('semimajorAxis');

let RADIUS = window.innerWidth,
    MARGIN = 50;

let svg;
let planets;

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

    //create the planets
    planets = svg.selectAll('circle.planet')
    .data(planetData)
    .enter()
    .append('circle')
    .attr('class', d => d.englishName.toLowerCase() + ' planet')
    .attr('cx', d => {
        return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis)*Math.PI/2)
    })
    .attr('cx', d => {
        return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis)*Math.PI/2)
    })
    .attr('r', d => {
        return (d.englishName === 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
    })

    addPlanetEvents();
}

function addPlanetEvents(){
    planets.map(p =>{
        const planet = document.querySelector(`.${p.englishName.toLowerCase()}`)

        planet.addEventListener('click', () =>{
            //add the planet to the planetBasket
        });

        // display the planet name when hovering over planet
        planet.addEventListener('mouseover', () =>{
            d3.select(`.${d.englishName.toLowerCase()}-label`)
            .style('display', () =>{
                if(window.scrollY / RADIUS*2 < 1) return 'block';
                else return 'none';
            });
        });

        // make the name disapear when hovering off planet
        planet.addEventListener('mouseout', () =>{
            d3.select(`.${d.englishName.toLowerCase()}-label`)
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
