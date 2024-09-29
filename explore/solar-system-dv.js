//get data
const url = 'https://api.le-systeme-solaire.net/rest/bodies/';
const RADIUS = window.innerWidth,
    MARGIN = 50;

let svg;
let planetData;
let minDistance, maxDistance;

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
        planetData = celestialBodies.filter(body => body.isPlanet || body.englishName === 'Sun');
        
        minDistance = d3.min(planetData, data => data.semimajorAxis);
        maxDistance = d3.max(planetData, data => data.semimajorAxis);
        // console.log(planetData);

        svg = d3.select('.solar-system')
                .attr('height', RADIUS*2)
                .attr('width', RADIUS)
                .append('g')
                .attr('height', RADIUS*2)
                .attr('width', RADIUS)
                .attr('transform', `translate(0,${RADIUS/2.25})`);
        
        const dScale = d3.scaleLinear()
                        .domain([minDistance, maxDistance])
                        .range([100, RADIUS]);

        const link = d3.linkRadial() 
                        .angle(d => 0) 
                        .radius(d => dScale(d.semimajorAxis)); 

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

        d3.selectAll("path") 
            .data(data) 
            .join("path") 
            .attr("d", link) 
    })
    .catch(error => {
        console.error('Error fetching planet data:', error);
    });

