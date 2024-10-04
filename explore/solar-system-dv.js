//get data
const url = 'https://api.le-systeme-solaire.net/rest/bodies/';
const RADIUS = window.innerWidth,
    MARGIN = 50,
    SUNRADIUS = 100;

let svg;
let _planetData;
let focusPlanet;
let planets;
let minDistance, maxDistance;
let minRadius, maxRadius;
const planetStatsCard = document.querySelector('.planet-stats-card');
export let selectedPlanets = [];


import { createStatCard } from "./planet-stat-card.js";
            

fetchPlanetData().then(planetData => {
    _planetData = planetData;
    if (planetData) renderSolarSystem(planetData);
});

/**
 * fetch planet data from API
 * @returns planetData
 */
export async function fetchPlanetData(){
    try{
        const response = await fetch(url);
        if(!response.ok) throw new Error('Issue with API');

        const data = await response.json();
        const celestialBodies = data.bodies;

        let planetData = celestialBodies.filter(body => body.isPlanet || body.englishName === 'Sun');

        processPlanetData(planetData);

        return planetData;
    }
    catch (error){
        console.error('Error fetching planet data:', error);
        return null;
    }
}

/**
 * sorts the planetData to get the MIN and MAX of Radius and Semi-major Axis
 * @param {Promise} planetData 
 */
function processPlanetData(planetData){
    //sorts by meanRadius
    planetData.sort((a, b) => a.meanRadius - b.meanRadius);
    minRadius = d3.min(planetData, data => data.meanRadius);
    maxRadius = planetData[planetData.length - 2].meanRadius; //excludes the sun

    //sorts by distance from the sun
    planetData.sort((a,b) => a.semimajorAxis - b.semimajorAxis);
    minDistance = 0; 
    maxDistance = d3.max(planetData, data => data.semimajorAxis);
}

/**
 * renders the planet data viz
 * @param {Promise} planetData 
 */
function renderSolarSystem(planetData){
    svg = d3
    .select('.solar-system')
    .attr('height', RADIUS*2.5)
    .attr('width', RADIUS)
    .attr('transform-origin', 'top left')
    .attr('transform', `translate(0,${-RADIUS/1.75})`)
    .append('g')
    .attr('class', 'ss-inner')
    .attr('height', RADIUS*2)
    .attr('width', RADIUS)
    .attr('transform', `translate(${MARGIN/2},${RADIUS})`);

    // distance scale
    const dScale = d3
        .scaleLinear()
        .domain([minDistance, maxDistance])
        .range([SUNRADIUS, RADIUS-MARGIN]);

    // angle scale
    let minAngle = 4,
        maxAngle = 3.75;
    let aScale = d3
        .scaleLinear()
        .domain([minDistance, maxDistance])
        .range([minAngle, maxAngle]);

    // radius scale
    const rScale = d3
        .scaleLinear()
        .domain([minRadius, maxRadius])
        .range([3, 35]);

    // create semimajorAxis lines for each planet
    svg.selectAll('circle')
        .data(planetData)
        .enter()
        .append('circle')
        .attr('class', 'semimajorAxis')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', d => dScale(d.semimajorAxis)) // Use scaled semimajor axis as radius
        .style('fill', 'none')  // No fill for outline effect
        .style('stroke', 'white')  // Outline color

    //create planets on the lines
    planets = svg
        .selectAll('circle.planet')
        .data(planetData)
        .enter()
        .append('circle')
        .attr('class', d => d.englishName.toLowerCase() + ' planet')
        .attr('cx', d => {
            let xPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis)*Math.PI/2);
            return xPos;
        })
        .attr('cy', d => {
            let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis)*Math.PI/2);
            return yPos;
        })
        .attr('r', d => {
            let radius = (d.englishName === 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
            return radius;
        })
        .on('click', (event, d) =>{
            let planet = d;
            if(!selectedPlanets.includes(planet)){
                selectedPlanets.push(planet);
            }
            else{
                selectedPlanets = selectedPlanets.filter(p => p !== planet);
            }

            updatePlanetBasket();
        });
    
    const zoom = d3
        .zoom()
        .on('zoom', (event) => {
            // Apply the transformation on zoom
            svg.attr('transform', event.transform);
        });

    //d3.select('.solar-system').call(zoom);
    
    window.addEventListener('scroll', () => {
        
        let scrollValue = window.scrollY / RADIUS*2; // get scroll percentage of svg
        
        let startDelta = (5-minAngle) * scrollValue; // calc delta via percentage for start value
        let endDelta = (5-maxAngle) * scrollValue;   // calc delta via percentage for end value

        let newRangeStart = minAngle + startDelta;
        let newRangeEnd = maxAngle + endDelta;

        // Update the range of the scale
        aScale.range([newRangeStart, newRangeEnd]);

        const SCROLLTHRESH = 1;

        if(scrollValue <= SCROLLTHRESH){
            // d3.select('.ss-inner')
            // .transition()
            // .duration(1200)
            planetStatsCard.style.display = 'none';

            d3.select('.ss-inner')
            .transition()
            .duration(1200)
            .attr('transform', `translate(${MARGIN/2},${RADIUS})`)
            .call(zoom.transform, d3.zoomIdentity
                .translate(0, 0))
            .on('start', () => {
                d3.zoomIdentity.x = MARGIN/2;
                d3.zoomIdentity.y = RADIUS;
            });

            d3.select('.solar-system')
            .transition()
            .duration(1200)
            .attr('height', RADIUS*2.5);

            planets
                .attr('cx', d => {
                    let xPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis) * Math.PI / 2);
                    return xPos;
                })
                .attr('cy', d => {
                    let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis) * Math.PI / 2);
                    return yPos;
                });
        }
        else if (scrollValue < 2.8){
            planetStatsCard.style.display = 'flex';
            planets
                .attr('cx', d => {
                    let xPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(5 * Math.PI / 2);
                    return xPos;
                })
                .attr('cy', d => {
                    let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(5 * Math.PI / 2);
                    return yPos;
                });
            
            if (scrollValue < 1.2)focusPlanet = findPlanet('Sun');
            else if (scrollValue < 1.4) focusPlanet = findPlanet('Mercury');
            else if (scrollValue < 1.6) focusPlanet = findPlanet('Venus');
            else if (scrollValue < 1.8) focusPlanet = findPlanet('Earth');
            else if (scrollValue < 2.0) focusPlanet = findPlanet('Mars');
            else if (scrollValue < 2.2) focusPlanet = findPlanet('Jupiter');
            else if (scrollValue < 2.4) focusPlanet = findPlanet('Saturn');
            else if (scrollValue < 2.6) focusPlanet = findPlanet('Uranus');
            else if (scrollValue < 2.8) focusPlanet = findPlanet('Neptune');
            
            createStatCard();
            
            // Calculate the desired transform for zoom
            const y = focusPlanet.englishName === 'Sun' ? 0 : dScale(focusPlanet.semimajorAxis);
            let scale = calcScale((focusPlanet.englishName == 'Sun') ? 100: rScale(focusPlanet.meanRadius));
            let strokeWidth = calcStrokeWidth((focusPlanet.englishName == 'Sun') ? 100: rScale(focusPlanet.meanRadius));

            // Center the planet on the screen
            const windowHeight = window.innerHeight/2;  // Height of the screen (viewBox)

            d3.select('.ss-inner')
            .transition()
            .duration(1200)
            .call(zoom.transform, d3.zoomIdentity
                .translate(RADIUS / 3, windowHeight + MARGIN * 1.225)
            .scale(scale))
            .on("start", () => {
                //fixed zoom here
                d3.zoomIdentity.x = MARGIN/2;
                d3.zoomIdentity.y = window.scrollY + RADIUS/2 - y*scale;
            });

            d3.selectAll('.semimajorAxis')
            .transition()
            .duration(500)
            .style('stroke-width', strokeWidth);

            d3.select('.solar-system')
            .transition()
            .duration(500)
            .attr('height', RADIUS*2.5);
        }
        else{
            planetStatsCard.style.display = 'none';

            d3.select('.ss-inner')
            .transition()
            .duration(1200)
            .attr('transform', `translate(${MARGIN/2},${RADIUS})`)
            .call(zoom.transform, d3.zoomIdentity
                .translate(0, 0))
            .on('start', () => {
                d3.zoomIdentity.x = MARGIN/2;
                d3.zoomIdentity.y = RADIUS;
            });

            d3.select('.solar-system')
            .transition()
            .duration(1200)
            .attr('height', RADIUS*1.5);
        }
    });
}

function updatePlanetBasket() {
    let ul = d3.select('.planet-basket ul');
    ul.selectAll('li').remove(); // Clear existing items in the list
    const rScale = d3
        .scalePow()
        .exponent(1)
        .domain([minRadius, maxRadius])
        .range([4, 25]);

    // Create a new `li` for each selected planet
    let li = ul.selectAll('li')
        .data(selectedPlanets)
        .enter()
        .append('li')
        .style('display', 'flex')  // Flex display for SVG and text alignment
        .style('align-items', 'center')
        .style('gap', '10px');  // Add spacing between SVG and text

    // Append an SVG to each `li`
    li.append('svg')
        .attr('width', d => {
            let radius = (d.englishName === 'Sun') ? 60 : rScale(d.meanRadius);
            return radius;
        })  // Width of SVG container
        .attr('height', d => {
            let radius = (d.englishName === 'Sun') ? 60 : rScale(d.meanRadius);
            return radius;
        })  // Height of SVG container
        .attr('class', 'planet-svg-container')
        .append('circle')  // Append a circle to each SVG
        .attr('cx', '50%')  // Center of the circle (x)
        .attr('cy', '50%')  // Center of the circle (y)
        .attr('r', d => {
            let radius = (d.englishName === 'Sun') ? 60/2 : rScale(d.meanRadius)/2;
            return radius;
        })  // Scale radius based on meanRadius
        .attr('class', d => d.englishName.toLowerCase())  // Color of the circle
        .on('click', (event, d) =>{
            let planet = d;
            if(!selectedPlanets.includes(planet)){
                selectedPlanets.push(planet);
            }
            else{
                selectedPlanets = selectedPlanets.filter(p => p !== planet);
            }

            updatePlanetBasket();
        });
}

/**
 * getter function for focusPlanet
 * @returns focusPlanet
 */
export function getFocusPlanet(){
    return focusPlanet;
}

export function getPlanets(){
    return planets;
}

/**
 * @param {String} englishName planet to find
 * @returns focused planet
 */
function findPlanet(englishName){
    let selectPlanet;

    _planetData.map(planet => {
        d3.select(`.${planet.englishName.toLowerCase()}`)
        .attr('class', `${planet.englishName.toLowerCase()}`); //remove the focusPlanet class

        if(planet.englishName == englishName){
            selectPlanet = planet;
            d3.select(`.${englishName.toLowerCase()}`)
                .attr('class', `${englishName.toLowerCase()} focusPlanet`);
        } 
    })

    return selectPlanet;
}

/**
 * calculates the scale of within a range based on a radius
 * @param {Number} radius radius to base the scale on
 * @returns the scale 
 */
function calcScale(radius){
    const MAX_SCALE = 20,
     MIN_SCALE = 4;
    let diffScale = MAX_SCALE-MIN_SCALE;
    
    const MAX_RADIUS = SUNRADIUS,
    MIN_RADIUS = 5;
    let diffRadius = MAX_RADIUS-MIN_RADIUS;

    let percentage = radius/diffRadius;
    let scaleDelta = diffScale*percentage;

    return MAX_SCALE-scaleDelta;
}

function calcStrokeWidth(radius){
    const MAX_WIDTH = 1,
     MIN_WIDTH = 0.1;
    let diffWidth = MAX_WIDTH-MIN_WIDTH;
    
    const MAX_RADIUS = SUNRADIUS,
    MIN_RADIUS = 5;
    let diffRadius = MAX_RADIUS-MIN_RADIUS;

    let percentage = radius/diffRadius;
    let widthDelta = diffWidth*percentage;

    return MIN_WIDTH+widthDelta;
}
