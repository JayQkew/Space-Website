import { planetBasket, massNum, volumeNum } from "./planet-basket.js";

export function createSpiderChart() {
    // Remove existing chart if there is one
    d3.select(".spider-chart").remove();

    // Define the container for the spider chart
    const width = 500, height = 500;
    const radius = Math.min(width, height) / 2;
    const chartContainer = d3.select(".planet-spider-viz")
        .append("svg")
        .attr("class", "spider-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Define chart axes and scales
    const attributes = ['mass', 'radius', 'volume', 'density', 'gravity'];
    const maxValues = {
        mass: d3.max(planetBasket, d => d.mass ? d.mass.massValue : 0),
        radius: d3.max(planetBasket, d => d.meanRadius || 0),
        volume: d3.max(planetBasket, d => d.vol ? d.vol.volVal : 0),
        density: d3.max(planetBasket, d => d.density || 0),
        gravity: d3.max(planetBasket, d => d.gravity || 0)
    };
    const scales = {
        mass: d3.scaleLinear().domain([0, maxValues.mass]).range([0, radius]),
        radius: d3.scaleLinear().domain([0, maxValues.radius]).range([0, radius]),
        volume: d3.scaleLinear().domain([0, maxValues.volume]).range([0, radius]),
        density: d3.scaleLinear().domain([0, maxValues.density]).range([0, radius]),
        gravity: d3.scaleLinear().domain([0, maxValues.gravity]).range([0, radius])
    };

    // Draw the spider chart axes and labels
    attributes.forEach((attr, i) => {
        const angle = (2 * Math.PI / attributes.length) * i;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        chartContainer.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", x)
            .attr("y2", y)
            .attr("class", "axis-line")
            .style("color", "white");

        chartContainer.append("text")
            .attr("x", x * 1.1)
            .attr("y", y * 1.1)
            .attr("class", "axis-label")
            .text(attr);
    });

    // Draw the planets' data on the spider chart
    planetBasket.forEach(planet => {
        const dataPoints = attributes.map(attr => {
            const scale = scales[attr];
            const value = attr === 'mass' ? massNum(planet) :
                          attr === 'volume' ? volumeNum(planet) :
                          planet[attr] || 0;
            const angle = (2 * Math.PI / attributes.length) * attributes.indexOf(attr);
            return [Math.cos(angle) * scale(value), Math.sin(angle) * scale(value)];
        });

        chartContainer.append("polygon")
            .attr("points", dataPoints.map(d => d.join(",")).join(" "))
            .attr("class", "planet-data-polygon")
            .style("fill", "rgba(0, 150, 255, 0.2)");

        dataPoints.forEach(point => {
            chartContainer.append("circle")
                .attr("cx", point[0])
                .attr("cy", point[1])
                .attr("r", 3)
                .attr("class", "data-point");
        });
    });
}
