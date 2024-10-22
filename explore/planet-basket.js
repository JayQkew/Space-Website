import { getPlanetData } from "./planet-data.js";
export let planetBasket = [];

const planetData = await getPlanetData();
let svg = svgContainer.select('svg');
let Xforces = [];

function createSVG(){
    const svgContainer = d3.select('.planet-data-viz');
    if(svg.empty()){
        svg = svgContainer.append('svg')
        .attr('height', window.innerHeight/1.5)
        .attr('width', window.innerWidth);
    }
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

const rScale = d3.scaleLinear()
.domain(d3.extent(planetData, d => d.meanRadius))
.range([18, 210]);

const collideForce = d3.forceCollide(d => rScale(d.meanRadius));
const manyBody = d3.forceManyBody().strength(-100);

const forceY = d3.forceY(window.innerHeight / 3).strength(0.01);



createSVG();
updateForces();