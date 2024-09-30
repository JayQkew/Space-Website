//get data
const url = 'https://api.le-systeme-solaire.net/rest/bodies/';
const RADIUS = window.innerWidth-50,
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
                .attr('height', RADIUS*5)
                .attr('width', RADIUS)
                .attr('transform-origin', '50% left')
                .attr('transform', `translate(0,${-RADIUS/1.75})`)
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
            maxAngle = 3.75;
        let aScale = d3.scaleLinear()
                        // .exponent(2)
                        .domain([minDistance, maxDistance])
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
                            .attr('class', d => d.englishName.toLowerCase())
                            .attr('cx', d => {
                                let xPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis)*Math.PI/2);
                                return xPos;
                            })
                            .attr('cy', d => {
                                let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis)*Math.PI/2);
                                return yPos;
                            })
                            .attr('r', d => {
                                let radius = (d.englishName === 'Sun') ? SUNRADIUS : rScale(d.meanRadius);
                                return radius;
                            }
                                )
                            .attr('fill', 'white');


        const zoom = d3.zoom()
        .scaleExtent([1, 10]) // Allow zoom between 1x to 10x
        .on('zoom', (event) => {
            // Apply the transformation on zoom
            svg.attr('transform', event.transform);
        });

        //d3.select('.solar-system').call(zoom);
        
        window.addEventListener('scroll', () => {
            
            let scaleValue = window.scrollY / RADIUS*2; // get scroll percentage of svg
            console.log(scaleValue);
            
            let startDelta = (5-minAngle) * scaleValue; // calc delta via percentage for start value
            let endDelta = (5-maxAngle) * scaleValue;   // calc delta via percentage for end value

            let newRangeStart = minAngle + startDelta;
            let newRangeEnd = maxAngle + endDelta;
    
            // Update the range of the scale
            if(scaleValue <= 1){
                aScale.range([newRangeStart, newRangeEnd]);
    
                planets
                    .attr('cx', d => {
                        let xPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.cos(aScale(d.semimajorAxis) * Math.PI / 2);
                        return xPos;
                    })
                    .attr('cy', d => {
                        let yPos = (d.englishName === 'Sun') ? 0 : dScale(d.semimajorAxis) * Math.sin(aScale(d.semimajorAxis) * Math.PI / 2);
                        return yPos;
                    });
            }
            else{
                let focusPlanet;
                if (scaleValue < 1.5) {
                    // Focus on the Sun
                    focusPlanet = planetData[0];
                    d3.select('.sun').attr('fill', 'red');
                } else if (scaleValue < 2) {
                    // Focus on the closest planet (e.g., Mercury)
                    focusPlanet = planetData[1];
                    d3.select('.mercury').attr('fill', 'red');
                } else if (scaleValue < 2.5) {
                    // Focus on Venus
                    focusPlanet = planetData[2];
                    d3.select('.venus').attr('fill', 'red');
                } else if (scaleValue < 3) {
                    // Focus on Earth
                    focusPlanet = planetData[3];
                    d3.select('.earth').attr('fill', 'red');
                } else if (scaleValue < 3.5) {
                    // Focus on Mars
                    focusPlanet = planetData[4];
                    d3.select('.mars').attr('fill', 'red');
                } else if (scaleValue < 4) {
                    // Focus on Jupiter
                    focusPlanet = planetData[5];
                    d3.select('.jupiter').attr('fill', 'red');
                } else if (scaleValue < 4.5) {
                    // Focus on Saturn
                    focusPlanet = planetData[6];
                    d3.select('.saturn').attr('fill', 'red');
                } else if (scaleValue < 5) {
                    // Focus on Uranus
                    focusPlanet = planetData[7];
                    d3.select('.uranus').attr('fill', 'red');
                } else if (scaleValue < 5.5) {
                    // Focus on Neptune
                    focusPlanet = planetData[8];
                    d3.select('.neptune').attr('fill', 'red');
                }
                // Calculate the desired transform for zoom
                const x = dScale(focusPlanet.semimajorAxis) * Math.cos(aScale(focusPlanet.semimajorAxis) * Math.PI / 2);
                const y = dScale(focusPlanet.semimajorAxis);
                const scale = scaleValue; // Set desired zoom scale level

                d3.select('.solar-system').transition()
                .duration(500)
                .call(zoom.transform, d3.zoomIdentity.translate(RADIUS / 2, window.scrollY - y*1.25 + RADIUS/1.25).scale(1.5));
            }
        });

    })
    .catch(error => {
        console.error('Error fetching planet data:', error);
    });

