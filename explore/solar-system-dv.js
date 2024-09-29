//get data
const url = 'https://api.le-systeme-solaire.net/rest/bodies/';
const RADIUS = window.innerWidth,
    MARGIN = 50,
    SUNRADIUS = 100;

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
        planetData = celestialBodies.filter(body => body.isPlanet || body.englishName === 'Sun');

        planetData.sort((a, b) => a.semimajorAxis - b.semimajorAxis);
        
        minDistance = d3.min(planetData, data => data.semimajorAxis);
        maxDistance = d3.max(planetData, data => data.semimajorAxis);

        planetData.sort((a,b) => a.meanRadius - b.meanRadius);
        minRadius = d3.min(planetData, data => data.meanRadius);
        maxRadius = planetData[planetData.length-2].meanRadius;
        console.log(planetData[planetData.length-2]);

        planetData.sort((a, b) => a.semimajorAxis - b.semimajorAxis);

        svg = d3.select('.solar-system')
                .attr('height', RADIUS*2)
                .attr('width', RADIUS)
                .append('g')
                .attr('height', RADIUS*2)
                .attr('width', RADIUS)
                .attr('transform', `translate(0,${RADIUS/2.5})`);
        
        const dScale = d3.scaleLinear()
                        .domain([minDistance, maxDistance])
                        .range([SUNRADIUS, RADIUS-MARGIN]);
        
        let aScale = d3.scalePow()
                        .exponent(2)
                        .domain([0, 9])
                        .range([4, 3.675]);
        
        const rScale = d3.scaleLinear()
                        .domain([minRadius, maxRadius])
                        .range([5, 35]);

        // create semimajorAxis lines
        svg.selectAll('circle.orbit')
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
        let planets = svg.selectAll('circle.planet')
                            .data(planetData)
                            .enter()
                            .append('circle')
                            .attr('cx', (d,i) => {
                                let xPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(i)*Math.PI/2);
                                return xPos;
                            })
                            .attr('cy', (d,i) => {
                                let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(i)*Math.PI/2);
                                return yPos;
                            })
                            .attr('r', d => {
                                let radius = (d.englishName === 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
                                return radius;
                            }
                                )
                            .attr('fill', 'white');

        window.addEventListener('scroll', () => {
            // Adjust scaleValue based on scroll position
            let scaleValue = window.scrollY / window.innerHeight; // Adjust the denominator for sensitivity
            console.log(scaleValue);
            let startDelta = (5-4) * scaleValue; // Adjust starting value toward 5
            let endDelta = (5-3.675) * scaleValue; // Adjust ending value toward 5

            let newRangeStart = 4 + startDelta;
            let newRangeEnd = 3.675 + endDelta;
    
            // Update the range of the scale
            aScale.range([newRangeStart, newRangeEnd]);

            planets
                .attr('cx', (d, i) => {
                    let xPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(i) * Math.PI / 2);
                    return xPos;
                })
                .attr('cy', (d, i) => {
                    let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(i) * Math.PI / 2);
                    return yPos;
                });
        });

    })
    .catch(error => {
        console.error('Error fetching planet data:', error);
    });

