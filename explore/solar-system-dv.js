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
        const celestialBodies = data.bodies;

        // Filter the array to get only the planets and the Sun
        planetData = celestialBodies.filter(body => body.isPlanet || body.englishName === 'Sun');

        //sorts the array based on meanRadius
        planetData.sort((a, b) => a.meanRadius - b.meanRadius);
        minRadius = d3.min(planetData, data => data.meanRadius);
        maxRadius = planetData[planetData.length-2].meanRadius; //we dont want to include the sun so its 'planetData[planetData.length-2]'

        //sorts the array based on distance from the sun (semimajorAxis)
        planetData.sort((a, b) => a.semimajorAxis - b.semimajorAxis);
        minDistance = 0;    //the suns distance from the sun...
        maxDistance = d3.max(planetData, data => data.semimajorAxis);

        svg = d3.select('.solar-system')
                .attr('height', RADIUS*2)
                .attr('width', RADIUS)
                .attr('transform', `translate(0,${-RADIUS/2})`)
                .append('g')
                .attr('height', RADIUS*2)
                .attr('width', RADIUS)
                .attr('transform', `translate(${MARGIN/2},${RADIUS})`);
        
        // distance scale
        const dScale = d3.scaleLinear()
                        .domain([minDistance, maxDistance])
                        .range([SUNRADIUS, RADIUS-MARGIN]);
        
        // angle scale
        let minAngle = 4,
            maxAngle = 3.5;
        let aScale = d3.scalePow()
                        .exponent(2)
                        .domain([0, 9])
                        .range([minAngle, maxAngle]);
        
        // radius scale
        const rScale = d3.scaleLinear()
                        .domain([minRadius, maxRadius])
                        .range([5, 35]);

        // create semimajorAxis lines for each planet
        svg.selectAll('circle')
            .data(planetData)
            .enter()
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', d => dScale(d.semimajorAxis)) // Use scaled semimajor axis as radius
            .style('fill', 'none')  // No fill for outline effect
            .style('stroke', 'white')  // Outline color
            .style('stroke-width', 1);

        //create planets on the lines
        let planets = svg.selectAll('circle.planet')
                            .data(planetData)
                            .enter()
                            .append('circle')
                            .attr('class', d => d.englishName)
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
            let scaleValue = window.scrollY / RADIUS*2; // get scroll percentage of svg

            let startDelta = (5-minAngle) * scaleValue; // calc delta via percentage for start value
            let endDelta = (5-maxAngle) * scaleValue;   // calc delta via percentage for end value

            let newRangeStart = minAngle + startDelta;
            let newRangeEnd = maxAngle + endDelta;
    
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

