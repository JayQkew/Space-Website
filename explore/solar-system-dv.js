//get data
const url = 'https://api.le-systeme-solaire.net/rest/bodies/';
const RADIUS = window.innerWidth,
    MARGIN = 50,
    SUNRADIUS = 100;

let svg;
let _planetData;
let focusPlanet;
let planets, planetText;
let minDistance, maxDistance;
let planetDataViz = false;
export let minRadius, maxRadius;
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
    // .attr('transform-origin', 'top left')
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
        })    
        .on('mouseover', function(event, d) {
            // Show the text label on hover
            console.log('hover over ' + d.englishName);
            d3.select(`.${d.englishName.toLowerCase()}-label`).style('display', () => {
                if(window.scrollY / RADIUS*2 < 1){
                    return 'block';
                }
                else{
                    return 'none';
                }
            });
        })
        .on('mouseout', function(event, d) {
            // Hide the text label when not hovering
            d3.select(`.${d.englishName.toLowerCase()}-label`).style('display', 'none');
        });

    planetText = svg.selectAll('text.planet')
        .data(planetData)
        .enter()
        .append('text')
        .attr('class',d => `${d.englishName.toLowerCase()}-label`)
        .attr('x', d => {
            let xPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis) * Math.PI / 2);
            return xPos;
        })
        .attr('y', d => {
            let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis) * Math.PI / 2);
            let radius = (d.englishName === 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
            return yPos - radius - 15;
        })
        .style('display', 'none') // Initially hide the labels
        .style('fill', 'white') // Set text color to white
        .style('font-size', '12px') // Set font size
        .text(d => d.englishName); // Set the text content to the planet's name
    
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
            
            planetText
                .attr('x', d => {
                    let xPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis) * Math.PI / 2);
                    return xPos;
                })
                .attr('y', d => {
                    let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis) * Math.PI / 2);
                    let radius = (d.englishName === 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
                    return yPos - radius - 15;
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
            planetText
                .style('display', 'none');
            
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

            planetDataViz = false;
            document.querySelector('.sort-btn-container').style.display = 'none';
            document.querySelector('aside').style.left = '75%';

        }
        else{
            planetStatsCard.style.display = 'none';
            document.querySelector('.sort-btn-container').style.display = 'flex';
            document.querySelector('aside').style.left = '50%';

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
            .attr('height', RADIUS*2);

            if(planetDataViz === false){
                createBubbles();
                planetDataViz = true;
            }
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
        .range([4, 10]);

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
            let radius = (d.englishName === 'Sun') ? 15 : rScale(d.meanRadius);
            return radius;
        })  // Width of SVG container
        .attr('height', d => {
            let radius = (d.englishName === 'Sun') ? 15 : rScale(d.meanRadius);
            return radius;
        })  // Height of SVG container
        .attr('class', 'planet-svg-container')
        .append('circle')  // Append a circle to each SVG
        .attr('cx', '50%')  // Center of the circle (x)
        .attr('cy', '50%')  // Center of the circle (y)
        .attr('r', d => {
            let radius = (d.englishName === 'Sun') ? 15 / 2 : rScale(d.meanRadius) / 2;
            return radius;
        })  // Scale radius based on meanRadius
        .attr('class', d => d.englishName.toLowerCase())  // Color of the circle
        .on('click', (event, d) => {
            let planet = d;
            if (!selectedPlanets.includes(planet)) {
                selectedPlanets.push(planet);
            } else {
                selectedPlanets = selectedPlanets.filter(p => p !== planet);
            }

            updatePlanetBasket();
            createBubbles();  // Call createBubbles every time selectedPlanets is changed
        });

    createBubbles();  // Update bubbles whenever the basket is updated
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

function createBubbles() {
    const svgContainer = d3.select('.planet-data-viz');

    // Check if the svg already exists, if not, create a new one
    let svg = svgContainer.select('svg');
    if (svg.empty()) {
        svg = svgContainer
            .append('svg')
            .attr('height', window.innerHeight/1.5)
            .attr('width', window.innerWidth);
    }

    let rScale = d3.scaleLinear()
        .domain(d3.extent(_planetData, d => d.meanRadius))
        .range([18, 210]);

    let Xforces = [];

    // Force configuration for different parameters
    const forceX = d3.forceX(window.innerWidth / 2).strength(0.04);
    const forceY = d3.forceY(window.innerHeight / 3).strength(0.01);
    const collideForce = d3.forceCollide(d => rScale(d.meanRadius));
    const manyBody = d3.forceManyBody().strength(-100);
    Xforces.push({ name: 'Regular', force: forceX });
    
    // Create scales for different properties
    const mScale = d3.scaleLinear()
        .domain(d3.extent(selectedPlanets, d => massNum(d)))
        .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    const forceMass = d3.forceX(d => mScale(massNum(d))).strength(0.15);
    Xforces.push({ name: 'Mass', force: forceMass });
    
    const _rScale = d3.scaleLinear()
        .domain(d3.extent(selectedPlanets, d => d.meanRadius))
        .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    const forceRadius = d3.forceX(d => _rScale(d.meanRadius)).strength(0.15);
    Xforces.push({ name: 'Radius', force: forceRadius });  // Added name for radius force
    
    const vScale = d3.scaleLinear()
        .domain(d3.extent(selectedPlanets, d => volumeNum(d)))
        .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    const forceVolume = d3.forceX(d => vScale(volumeNum(d))).strength(0.15);
    Xforces.push({ name: 'Volume', force: forceVolume });  // Added name for volume force
    
    const dScale = d3.scaleLinear()
        .domain(d3.extent(selectedPlanets, d => d.density))
        .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    const forceDensity = d3.forceX(d => dScale(d.density)).strength(0.15);
    Xforces.push({ name: 'Density', force: forceDensity });  // Added name for density force
    
    const gScale = d3.scaleLinear()
        .domain(d3.extent(selectedPlanets, d => d.gravity))
        .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    const forceGravity = d3.forceX(d => gScale(d.gravity)).strength(0.15);
    Xforces.push({ name: 'Gravity', force: forceGravity });  // Added name for gravity force
    

    const sortBtns = document.querySelector('.sort-btn-container');
    sortBtns.innerHTML = '';
    Xforces.map(force =>{
        // let btn = `<button class="sort-btn" data-type="${force.name}">${force.name}</button>`
        let btn = document.createElement('button');
        btn.classList.add('sort-btn');
        btn.setAttribute('data-type', force.name);
        btn.innerHTML = force.name;
        btn.addEventListener('click', () =>{
            simulation.force('x', force.force)
            .alpha(1)
            .restart();
        })
        sortBtns.appendChild(btn);
    })

    const simulation = d3.forceSimulation()
        .force('x', forceX)
        .force('y', forceY)
        .force('collide', collideForce)
        .force('manyBody', manyBody);

    // Bind data to circles, using 'join' to handle enter, update, and exit selections
    let bubbles = svg
        .selectAll('circle')
        .data(selectedPlanets, d => d.englishName)  // Use a unique key (e.g., id or name)
        .join(
            enter => enter.append('circle')
                .attr('r', d => rScale(d.meanRadius))
                .attr('class', d => d.englishName.toLowerCase() + ' planet'),
            update => update,  // Update existing circles
            exit => exit.remove()  // Remove unneeded circles
        );

    let labels = svg
    .selectAll('text.planet-label')
    .data(selectedPlanets, d => d.englishName)
    .join(
        enter => enter.append('text')
            .attr('class', 'planet-label')
            .style('fill', 'white')
            .style('font-size', '14px')
            .attr('text-anchor', 'middle')
            .text(d => d.englishName),
        update => update,
        exit => exit.remove()
    );
    // Update the positions of bubbles on each tick of the simulation
    simulation.nodes(selectedPlanets).on('tick', () => {
        bubbles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        labels
            .attr('x', d => d.x)
            .attr('y', d => d.y + rScale(d.meanRadius) + 15);  // Position the label slightly below the bubble

    });

    simulation.alpha(1).restart();
}

/**
 * @param {Object} planet 
 * @returns numerical value of the scientific notation
 */
function massNum(planet){
    return planet.mass.massValue * Math.pow(10, planet.mass.massExponent);
}

/**
 * @param {Object} planet 
 * @returns numerical value of the scientific notation
 */
function volumeNum(planet){
    return planet.vol.volValue * Math.pow(10, planet.vol.volExponent);
}