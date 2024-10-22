import { getPlanetData } from "./planet-data.js";
export let planetBasket = [];

const planetData = await getPlanetData();
let Xforces = [];

function createSVG(){
    const svgContainer = d3.select('.planet-data-viz');
    let svg = svgContainer.select('svg');
    if(svg.empty()){
        svg = svgContainer.append('svg')
        .attr('height', window.innerHeight/1.5)
        .attr('width', window.innerWidth);
    }
}

let rScale = d3.scaleLinear()
.domain(d3.extent(planetData, d => d.meanRadius))
.range([18, 210]);