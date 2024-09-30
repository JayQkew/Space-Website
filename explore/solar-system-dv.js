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
                .attr('height', RADIUS*5)
                .attr('width', RADIUS)
                .attr('transform-origin', 'top left')
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
        // .scaleExtent([1, 10]) // Allow zoom between 1x to 10x
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
            aScale.range([newRangeStart, newRangeEnd]);
            if(scaleValue <= 1){

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
                if (scaleValue < 1.2) {
                    // Focus on the Sun
                    focusPlanet = planetData[0];
                    d3.select('.sun').attr('stroke-width', '2').attr('stroke', 'red');
                } else if (scaleValue < 1.3) { // 1.2 + 0.1
                    // Focus on the closest planet (e.g., Mercury)
                    focusPlanet = planetData[1];
                    d3.select('.mercury').attr('stroke-width', '2').attr('stroke', 'red');
                } else if (scaleValue < 1.4) { // 1.3 + 0.1
                    // Focus on Venus
                    focusPlanet = planetData[2];
                    d3.select('.venus').attr('stroke-width', '2').attr('stroke', 'red');
                } else if (scaleValue < 1.5) { // 1.4 + 0.1
                    // Focus on Earth
                    focusPlanet = planetData[3];
                    d3.select('.earth').attr('stroke-width', '2').attr('stroke', 'red');
                } else if (scaleValue < 1.6) { // 1.5 + 0.1
                    // Focus on Mars
                    focusPlanet = planetData[4];
                    d3.select('.mars').attr('stroke-width', '2').attr('stroke', 'red');
                } else if (scaleValue < 1.7) { // 1.6 + 0.1
                    // Focus on Jupiter
                    focusPlanet = planetData[5];
                    d3.select('.jupiter').attr('stroke-width', '2').attr('stroke', 'red');
                } else if (scaleValue < 1.8) { // 1.7 + 0.1
                    // Focus on Saturn
                    focusPlanet = planetData[6];
                    d3.select('.saturn').attr('stroke-width', '2').attr('stroke', 'red');
                } else if (scaleValue < 1.9) { // 1.8 + 0.1
                    // Focus on Uranus
                    focusPlanet = planetData[7];
                    d3.select('.uranus').attr('stroke-width', '2').attr('stroke', 'red');
                } else if (scaleValue < 2.0) { // 1.9 + 0.1
                    // Focus on Neptune
                    focusPlanet = planetData[8];
                    d3.select('.neptune').attr('stroke-width', '2').attr('stroke', 'red');
                }
                                
                // Calculate the desired transform for zoom
                const y = focusPlanet.englishName === 'Sun' ? 0 : dScale(focusPlanet.semimajorAxis);
                const scale = 2;

                const currentTransform = d3.zoomTransform(svg.node());
                const currentX = currentTransform.x;
                const currentY = currentTransform.y;
                const currentScale = currentTransform.k;

                // Center the planet on the screen
                const svgHeight = window.innerHeight/2;  // Height of the screen (viewBox)

                d3.select('.solar-system')
                .transition()
                .duration(500)
                .call(zoom.transform, d3.zoomIdentity.translate(RADIUS / 2, (svgHeight + window.scrollY + RADIUS/2 - y*scale))
                .scale(scale));
                

            }
        });

    })
    .catch(error => {
        console.error('Error fetching planet data:', error);
    });

