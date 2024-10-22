import { getPlanetData } from "./planet-data.js";
import { planetBasket } from "./planet-basket.js";

const planetData = await getPlanetData();

const SUNRADIUS = 100;
const ZOOM = d3.zoom().on('zoom', e => svg.attr('transform', e.transform));
const SCROLLTHRESHHOLD = 1; // scrollValue threshold before zoom transition

let extentRadius = getRadiusExtent(),
    extentDistance = getDistanceExtent();

let RADIUS = window.innerWidth,
    MARGIN = 50;

let svg;
let planets, planetTexts;
let minPlanetAngle = 4,
    maxPlanetAngle = 3.75,
    planetAngleBarrier = 5;
let scrollValue;

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
    .attr('r', d => {
        return (d.englishName === 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
    });

    addPlanetEvents();

    planetTexts = svg.selectAll('text.planet')
    .data(planetData)
    .enter()
    .append('text')
    .attr('class', d => `${d.englishName.toLowerCase()}-label planet-label`)
    .text(d => d.englishName);

    updatePositions();
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
.range([minPlanetAngle, maxPlanetAngle]);

/**
 * changes the planets angles based on scroll
 * the planets will move along their respective rings and eventually align bellow the sun
 */
function updatePlanetAngle(){
    scrollValue = window.scrollY / RADIUS*2;

    let angleRangeStart = minPlanetAngle + ((planetAngleBarrier-minPlanetAngle) * scrollValue);
    let angleRangeEnd = maxPlanetAngle + ((planetAngleBarrier-maxPlanetAngle) * scrollValue);

    aScale.range([angleRangeStart, angleRangeEnd]);
}

/**
 * sets the zoom positions of the svg and zoom to their starting positions
 */
function solarSystemZoomStart(){
    d3.select('.ss-inner')
    .transition()
    .duration(1200)
    .attr('transform', `translate(${MARGIN/2},${RADIUS})`)
    .call(ZOOM.transform, d3.zoomIdentity.translate(0 ,0))
    .on('start', () => {
        d3.zoomIdentity.x = MARGIN/2;
        d3.zoomIdentity.y = RADIUS;
    });

    d3.select('.solar-system')
    .transition()
    .duration(1200)
    .attr('height', RADIUS*2.5);
}

/**
 * updates the positions of the planets and planetTexts
 */
function updatePositions(){
    if(scrollValue >= SCROLLTHRESHHOLD){
        planets.attr('cx', d => {
            return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(5 * Math.PI / 2);
        })
        .attr('cy', d => {
            return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(5 * Math.PI / 2);
        });

        //error prevention
        if(typeof planetText !== 'undefined') planetText?.style('display', 'none');
    }
    else{
        planets.attr('cx', d => {
            return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis) * Math.PI / 2);
        })
        .attr('cy', d => {
            return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis) * Math.PI / 2);
        });
    
        planetTexts.attr('x', d => {
            return (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis) * Math.PI / 2);
        })
        .attr('y', d => {
            let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis) * Math.PI / 2);
            let radius = (d.englishName === 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
            return yPos - radius - 15;
        });
    }
}

renderSolarSystem();

window.addEventListener('scroll', () => {
    updatePlanetAngle();
    updatePositions();
    if(scrollValue <= SCROLLTHRESHHOLD){
        // planetStatsCard.style.display = 'none';
        solarSystemZoomStart();
    }
})