import { getPlanetData } from "./planet-data.js";
export let planetBasket = [];

const planetData = await getPlanetData();
let svg;
let Xforces = [];
let bubbles, labels;

function createSVG(){
    const svgContainer = d3.select('.planet-data-viz');

    // Check if the svg already exists, if not, create a new one
    svg = svgContainer.select('svg');
    if (svg.empty()) {
        svg = svgContainer
            .append('svg')
            .attr('height', window.innerHeight/1.5)
            .attr('width', window.innerWidth);
    }
}

//#region
function createBubble(){
    bubbles = svg.selectAll('circle')
    .data(planetBasket, d => d.englishName)
    .join(
        enter => enter.append('circle')
            .attr('r', d => rScale(d.meanRadius))
            .attr('class', d => d.englishName.toLowerCase() + ' planet'),
        update => update,
        exit => exit.remove()
    );

    labels = svg.selectAll('text.planet-label')
    .data(planetBasket, d => d.englishName)
    .join(
        enter => enter.append('text')
            .attr('class', 'planet-label')
            .attr('text-anchor', 'middle')
            .text(d => d.englishName),
        update => update,
        exit => exit.remove()
    );

    simulation.nodes(planetBasket).on('tick', () => {
        bubbles.attr('cx', d => d.x)
        .attr('cy', d => d.y);

        labels.attr('x', d => d.x)
        .attr('y', d => d.y + rScale(d.meanRadius) + 15);
    })

    simulation.alpha(1).restart();
}

/**
 * adds the force or updates the force if it exists already
 * @param {String} name name of the force
 * @param {Object} force force Object
 */
function addForce(name, force){
    const existingForce = Xforces.find(f => f.name === name);
    if (!existingForce) {
        Xforces.push({ name, force });
    }
}

/**
 * update all the forces based on the planetBasket
 */
function updateForces(){
    addForce('Regular', d3.forceX(window.innerWidth / 2).strength(0.04));

    const mScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => massNum(d)))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    addForce('Mass', d3.forceX(d => mScale(massNum(d))).strength(0.15));

    const _rScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => d.meanRadius))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    addForce('Radius', d3.forceX(d => _rScale(d.meanRadius)).strength(0.15));

    const vScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => volumeNum(d)))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    addForce('Volume', d3.forceX(d => vScale(volumeNum(d))).strength(0.15))

    const dScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => d.density))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    addForce('Density', d3.forceX(d => dScale(d.density)).strength(0.15));

    const gScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => d.gravity))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    addForce('Force', d3.forceX(d => gScale(d.gravity)).strength(0.15));
}

const rScale = d3.scaleLinear()
.domain(d3.extent(planetData, d => d.meanRadius))
.range([18, 210]);

const collideForce = d3.forceCollide(d => rScale(d.meanRadius));
const manyBody = d3.forceManyBody().strength(-100);

const forceY = d3.forceY(window.innerHeight / 3).strength(0.01);

const simulation = d3.forceSimulation()
.force('x', d3.forceX(window.innerWidth / 2).strength(0.04))  // Safely access the first force
.force('y', forceY)
.force('collider', collideForce)
.force('manyBody', manyBody);


simulation.alpha(1).restart();
createSVG();
updateForces();
//#endregion

export function createBubbles() {
    createSVG();

    // #region Scales
    const rScale = d3.scaleLinear()
    .domain(d3.extent(planetData, d => d.meanRadius))
    .range([18, 210]);

    const mScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => massNum(d)))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    
    const _rScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => d.meanRadius))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    
    const vScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => volumeNum(d)))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    
    const dScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => d.density))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    
    const gScale = d3.scaleLinear()
    .domain(d3.extent(planetBasket, d => d.gravity))
    .range([window.innerWidth / 4, window.innerWidth - window.innerWidth / 4]);
    // #endregion

    // #region adding forces
    const forceY = d3.forceY(window.innerHeight / 3).strength(0.01);
    const collideForce = d3.forceCollide(d => rScale(d.meanRadius));
    const manyBody = d3.forceManyBody().strength(-100);
    
    addForce('Regular', d3.forceX(window.innerWidth / 2).strength(0.04));
    addForce('Mass', d3.forceX(d => mScale(massNum(d))).strength(0.15));
    addForce('Radius', d3.forceX(d => _rScale(d.meanRadius)).strength(0.15));
    addForce('Volume', d3.forceX(d => vScale(volumeNum(d))).strength(0.15));
    addForce('Density', d3.forceX(d => dScale(d.density)).strength(0.15));
    addForce('Gravity', d3.forceX(d => gScale(d.gravity)).strength(0.15));
    // #endregion

    const sortBtns = document.querySelector('.sort-btn-container');
    sortBtns.innerHTML = '';
    Xforces.map(force =>{
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
        .force('x', d3.forceX(window.innerWidth / 2).strength(0.04))
        .force('y', forceY)
        .force('collide', collideForce)
        .force('manyBody', manyBody);

    // Bind data to circles, using 'join' to handle enter, update, and exit selections
    let bubbles = svg
        .selectAll('circle')
        .data(planetBasket, d => d.englishName)  // Use a unique key (e.g., id or name)
        .join(
            enter => enter.append('circle')
                .attr('r', d => rScale(d.meanRadius))
                .attr('class', d => d.englishName.toLowerCase() + ' planet'),
            update => update,  // Update existing circles
            exit => exit.remove()  // Remove unneeded circles
        );

    let labels = svg
    .selectAll('text.planet-label')
    .data(planetBasket, d => d.englishName)
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
    simulation.nodes(planetBasket).on('tick', () => {
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
function massNum(planet){ return planet.mass.massValue * Math.pow(10, planet.mass.massExponent)}

/**
 * @param {Object} planet 
 * @returns numerical value of the scientific notation
 */
function volumeNum(planet){ return planet.vol.volValue * Math.pow(10, planet.vol.volExponent);}
