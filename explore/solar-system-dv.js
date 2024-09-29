//get data
const url = 'https://api.le-systeme-solaire.net/rest/bodies/';
const RADIUS = window.innerWidth,
    MARGIN = 50;

let svg;
let planetData;
let minDistance, maxDistance;
let minRadius, maxRadius;

fetch(url)
    .then(response => {
        if(!response.ok){
            throw new Error('Issue with API');
        }
        return response.json();
    })
    .then(data => {
        // The 'bodies' property contains an array of all celestial bodies
        const celestialBodies = data.bodies;

        // Filter the array to get only the planets and the Sun
        planetData = celestialBodies.filter(body => body.isPlanet /*|| body.englishName === 'Sun'*/);

        planetData.sort((a, b) => a.semimajorAxis - b.semimajorAxis);
        
        minDistance = d3.min(planetData, data => data.semimajorAxis);
        maxDistance = d3.max(planetData, data => data.semimajorAxis);

        minRadius = d3.min(planetData, data => data.meanRadius);
        maxRadius = d3.max(planetData, data => data.meanRadius);
        console.log(planetData);

        svg = d3.select('.solar-system')
                .attr('height', RADIUS*2)
                .attr('width', RADIUS)
                .append('g')
                .attr('height', RADIUS*2)
                .attr('width', RADIUS)
                .attr('transform', `translate(0,${RADIUS/2.5})`);
        
        const dScale = d3.scaleLinear()
                        .domain([minDistance, maxDistance])
                        .range([10, RADIUS-MARGIN]);
        
        const aScale = d3.scalePow()
                        .exponent(2)
                        .domain([0, 10])
                        .range([4, 3.5]);
        
        const rScale = d3.scaleLinear()
                        .domain([minRadius, maxRadius])
                        .range([5, 75]);

        // create semimajorAxis lines
        svg.selectAll('circle')
            .data(planetData)
            .enter()
            .append('circle')
            .attr('r', d => dScale(d.semimajorAxis)) // Use scaled semimajor axis as radius
            .attr('cx', 0)
            .attr('cy', 0)
            .style('fill', 'none')  // No fill for outline effect
            .style('stroke', 'white')  // Outline color
            .style('stroke-width', 1);

        let multi = 3.71;
        //create planets on the lines
        svg.selectAll('circle.planet')
            .data(planetData)
            .enter()
            .append('circle')
            .attr('cx', (d,i) => dScale(d.semimajorAxis) * Math.cos(aScale(i)*Math.PI/2))
            .attr('cy', (d,i) => dScale(d.semimajorAxis) * Math.sin(aScale(i)*Math.PI/2))
            .attr('r', d => rScale(d.meanRadius))
            .attr('fill', 'white')

        
    })
    .catch(error => {
        console.error('Error fetching planet data:', error);
    });

