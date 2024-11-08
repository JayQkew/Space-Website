import { planetBasket, massNum, volumeNum } from "./planet-basket.js";
import { getDistanceExtent, getRadiusExtent } from "./render-solarsystem.js";
import { getPlanetData } from "./planet-data.js";

const planetData = await getPlanetData();

const WIDTH = 500,
    HEIGHT = 500,
    RADIUS = Math.min(WIDTH, HEIGHT) / 2;

/**
 * creates the svg for the data viz
 * @returns svg
 */
function creatSVG(){
    return d3.select(".planet-spider-viz")
    .append("svg")
    .attr("class", "spider-chart")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .append("g")
    .attr("transform", `translate(${WIDTH / 2}, ${HEIGHT / 2})`);
}

const chartContainer = creatSVG();
const attributes = ['mass', 'meanRadius', 'semimajorAxis', 'volume', 'density', 'gravity'];

attributes.forEach((attr, i) => {
    const angle = (2 * Math.PI / attributes.length) * i;
    const x = Math.cos(angle) * RADIUS;
    const y = Math.sin(angle) * RADIUS;

    chartContainer.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("class", "axis-line");

    chartContainer.append("text")
        .attr("x", x * 1.25)
        .attr("y", y *1.25)
        .attr("class", "axis-label")
        .style('fill', 'white')
        .text(attr);
});

export function createSpiderChart() {
    // Remove existing chart if there is one
    // d3.select(".spider-chart").remove();


    // Define chart axes and scales
    const maxRadius = d3.max(planetData, d => d.meanRadius); // is a function here
    const scales = {
        mass: d3.scaleLinear().domain([0, d3.max(planetData, d => d.mass.massValue)]).range([0, RADIUS]),
        meanRadius: d3.scaleLinear().domain([0, maxRadius]).range([0, RADIUS]),
        semimajorAxis: d3.scaleLinear().domain([0, d3.max(planetData, d => d.semimajorAxis)]).range([0, RADIUS]),
        volume: d3.scaleLinear().domain([0, d3.max(planetData, d => d.vol.volValue)]).range([0, RADIUS]),
        density: d3.scaleLinear().domain([0, d3.max(planetData, d => d.density)]).range([0, RADIUS]),
        gravity: d3.scaleLinear().domain([0, d3.max(planetData, d => d.gravity)]).range([0, RADIUS])
    };


    // Draw the spider chart axes and labels


    // console.log(document.querySelectorAll('.axis-label'));

    // Draw the planets' data on the spider chart
    planetBasket.forEach(planet => {
        const dataPoints = [...attributes].map(attr => {
            const scale = scales[attr];
            const rawValue = attr === 'mass' ? planet.mass.massValue :
                          attr === 'volume' ? planet.vol.volValue :
                          planet[attr];
            const value = Number(rawValue);
            console.log(planet.englishName + ' ' + attr + ': ' + value)
            const angle = (2 * Math.PI / attributes.length) * attributes.indexOf(attr);
            return [Math.cos(angle) * scale(value), Math.sin(angle) * scale(value)];
        });

        chartContainer.append("polygon")
            .attr("points", dataPoints.map(d => d.join(",")).join(" "))
            .attr("class", `planet-data-polygon ${planet.englishName.toLowerCase()}`);

        dataPoints.forEach(point => {
            chartContainer.append("circle")
                .attr("cx", point[0])
                .attr("cy", point[1])
                // .attr("r", 3)
                .attr("class", "data-point");
        });
    });
}
