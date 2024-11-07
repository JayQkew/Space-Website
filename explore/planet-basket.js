import { getPlanetData } from "./planet-data.js";
import { extentRadius } from "./render-solarsystem.js";
export let planetBasket = [];

const planetData = await getPlanetData();
let svg;
let Xforces = [];
let bubbles, labels;
let labelSpawned = false;

const infoBtn = document.querySelector('.info-btn');
const infoText = document.querySelector('.info-text');

infoBtn.addEventListener('mouseenter', () => {
    infoText.style.display = 'inline';
})
infoBtn.addEventListener('mouseleave', () => {
    infoText.style.display = 'none';
})


/**
 * creates the svg that the data viz will appear in
 */
function createSVG(){
    const svgContainer = d3.select('.planet-data-viz');
    // Check if the svg already exists, if not, create a new one
    svg = svgContainer.select('svg');
    if (svg.empty()) {
        svg = svgContainer
            .append('svg')
            .attr('height', window.innerHeight)
            .attr('width', window.innerWidth);
    }
}

/**
 * creates the sort buttons for the different value comparisons
 */
function createSortBtns(){
    const sortBtns = document.querySelector('.sort-btn-container');
    sortBtns.innerHTML = '';
    Xforces.forEach(force =>{
        let btn = document.createElement('button');
        btn.classList.add('sort-btn');
        btn.setAttribute('data-type', force.name);
        btn.innerHTML = force.name;
        if(force.name === 'None'){
            btn.classList.add('active');
        }
        btn.addEventListener('click', () =>{
            simulation.force('x', force.force)
            .alpha(1)
            .restart();
            
            document.querySelectorAll('.sort-btn').forEach(b => {
                b.classList.remove('active');
            })
            btn.classList.add('active');
        })
        sortBtns.appendChild(btn);
    })
}

/**
 * adds the force or updates the force if it exists already
 * @param {String} name name of the force
 * @param {Object} force force Object
 */
function addForce(name, force){
    const existingForce = Xforces.find(f => f.name === name);
    if (existingForce) {
        existingForce.force = force;  // Update the existing force
    } else {
        Xforces.push({ name, force });  // Add a new force if it doesn't exist
    }
}


/**
 * update all the forces based on the planetBasket
 */
function updateForces(){
    Xforces = [];

    addForce('None', d3.forceX(window.innerWidth / 2).strength(0.04));

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
    addForce('Gravity', d3.forceX(d => gScale(d.gravity)).strength(0.15));
}

const rScale = d3.scaleLinear()
.domain(d3.extent(planetData, d => d.meanRadius))
.range([18, 210]);

let simulation = d3.forceSimulation()
.force('x', d3.forceX(window.innerWidth / 2).strength(0.04))
.force('y', d3.forceY(window.innerHeight / 1.5).strength(0.1))
.force('collide', d3.forceCollide(d => rScale(d.meanRadius)))
.force('manyBody', d3.forceManyBody().strength(-100));

/**
 * creates force bubbles in a D3 physics simulation
 */
export function createBubbles() {
    createSVG();
    updateForces();
    createSortBtns();

    // Bind data to circles, using 'join' to handle enter, update, and exit selections
    bubbles = svg
        .selectAll('circle')
        .data(planetBasket, d => d.englishName)  // Use a unique key (e.g., id or name)
        .join(
            enter => enter.append('circle')
                .attr('r', d => rScale(d.meanRadius))
                .attr('class', d => d.englishName.toLowerCase() + ' planet'),
            update => update,  // Update existing circles
            exit => exit.remove()  // Remove unneeded circles
        );

    if (labelSpawned === false){
        labels = svg
        .selectAll('text.planet-label')
        .data(planetBasket, d => d.englishName)
        .join(
            enter => enter.append('text')
                .attr('class', d => `planet-grav-label ${d.englishName}`)   //make it the planets englishName here!!!
                .style('fill', 'white')
                .style('font-size', '14px')
                .attr('text-anchor', 'middle')
                .text(d => d.englishName),
            update => update
                .text(d => d.englishName)  // Ensure updated label text
                .attr('x', d => d.x)      // Update label position
                .attr('y', d => d.y + rScale(d.meanRadius) + 15), // Adjust label position,
            exit => exit.remove()
        );
        labelSpawned = true;
    }
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

/**
 * updates the planet baskets visuals and data
 */
export function updatePlanetBasket(){
    let ul = d3.select('.planet-basket ul');
    ul.selectAll('li').remove();

    const rScale = d3.scalePow()
    .exponent(1)
    .domain([extentRadius[0], extentRadius[1]])
    .range([4, 10])

    let li = ul.selectAll('li')
    .data(planetBasket)
    .enter()
    .append('li')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('gap', '10px');

    li.append('svg')
    .attr('width', d => {
        return (d.englishName === 'Sun') ? 15 : rScale(d.meanRadius);
    })
    .attr('height', d => {
        return (d.englishName === 'Sun') ? 15 : rScale(d.meanRadius);
    })
    .attr('class', 'planet-svg-container')
    .append('circle')
    .attr('cx', '50%')
    .attr('cy', '50%')
    .attr('r', d => {
        return (d.englishName === 'Sun') ? 15 / 2 : rScale(d.meanRadius) / 2;
    })
    .attr('class', d => d.englishName.toLowerCase())
    .on('click', (e, d) => {
        if(!planetBasket.includes(d)) planetBasket.push(planet);
        else planetBasket = planetBasket.filter(p => p !== d);

        updatePlanetBasket();
        createBubbles(); //make it only update the planets and not spawn bubbles

        const labelToRemove = document.querySelector(`.planet-grav-label.${d.englishName}`);
        if (labelToRemove) {
            labelToRemove.remove();
        }
        })

    // createBubbles();
}

function addTilt(){
    VanillaTilt.init(document.querySelector('.planet-basket'), {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
        reverse: true
    });
}

addTilt();