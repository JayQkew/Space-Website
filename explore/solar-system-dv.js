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

        svg = d3
            .select('.solar-system')
            .attr('height', RADIUS*5)
            .attr('width', RADIUS)
            .attr('transform-origin', 'top left')
            .attr('transform', `translate(0,${-RADIUS/1.75})`)
            .append('g')
            .attr('class', 'ss-inner')
            .attr('height', RADIUS*2)
            .attr('width', RADIUS)
            .attr('transform', `translate(${MARGIN/2},${RADIUS})`);
    
        // distance scale
        const dScale = d3
            .scaleLinear()
            .domain([minDistance, maxDistance])
            .range([SUNRADIUS, RADIUS-MARGIN]);
        
        // angle scale
        let minAngle = 4,
            maxAngle = 3.75;
        let aScale = d3
            .scaleLinear()
            // .exponent(2)
            .domain([minDistance, maxDistance])
            .range([minAngle, maxAngle]);
        
        // radius scale
        const rScale = d3
            .scaleLinear()
            .domain([minRadius, maxRadius])
            .range([3, 35]);

        // create semimajorAxis lines for each planet
        svg.selectAll('circle')
            .data(planetData)
            .enter()
            .append('circle')
            .attr('class', 'semimajorAxis')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', d => dScale(d.semimajorAxis)) // Use scaled semimajor axis as radius
            .style('fill', 'none')  // No fill for outline effect
            .style('stroke', 'white')  // Outline color

        //create planets on the lines
        let planets = svg
            .selectAll('circle.planet')
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
            });


        const zoom = d3
            .zoom()
            .on('zoom', (event) => {
                // Apply the transformation on zoom
                svg.attr('transform', event.transform);
            });

        //d3.select('.solar-system').call(zoom);
        
        window.addEventListener('scroll', () => {
            
            let scrollValue = window.scrollY / RADIUS*2; // get scroll percentage of svg
            //console.log(scrollValue);
            
            let startDelta = (5-minAngle) * scrollValue; // calc delta via percentage for start value
            let endDelta = (5-maxAngle) * scrollValue;   // calc delta via percentage for end value

            let newRangeStart = minAngle + startDelta;
            let newRangeEnd = maxAngle + endDelta;
    
            // Update the range of the scale
            aScale.range([newRangeStart, newRangeEnd]);

            const SCROLLTHRESH = 1;

            if(scrollValue <= SCROLLTHRESH){
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
                
                if (scrollValue < 1.2)focusPlanet = findPlanet('Sun');
                else if (scrollValue < 1.4) focusPlanet = findPlanet('Mercury');
                else if (scrollValue < 1.6) focusPlanet = findPlanet('Venus');
                else if (scrollValue < 1.8) focusPlanet = findPlanet('Earth');
                else if (scrollValue < 2.0) focusPlanet = findPlanet('Mars');
                else if (scrollValue < 2.2) focusPlanet = findPlanet('Jupiter');
                else if (scrollValue < 2.4) focusPlanet = findPlanet('Saturn');
                else if (scrollValue < 2.6) focusPlanet = findPlanet('Uranus');
                else if (scrollValue < 2.8) focusPlanet = findPlanet('Neptune');
                                                
                // Calculate the desired transform for zoom
                const y = focusPlanet.englishName === 'Sun' ? 0 : dScale(focusPlanet.semimajorAxis);
                let scale = calcScale((focusPlanet.englishName == 'Sun') ? 100: rScale(focusPlanet.meanRadius));
                let strokeWidth = calcStrokeWidth((focusPlanet.englishName == 'Sun') ? 100: rScale(focusPlanet.meanRadius));

                const currentTransform = d3.zoomTransform(svg.node());
                const currentX = currentTransform.x;
                const currentY = currentTransform.y;
                const currentScale = currentTransform.k;

                // Center the planet on the screen
                const svgHeight = window.innerHeight/2;  // Height of the screen (viewBox)

                d3.select('.ss-inner')
                .transition()
                .duration(1200)
                .call(zoom.transform, d3.zoomIdentity
                    .translate(RADIUS / 3, svgHeight)
                .scale(scale))
                .on("start", () => {
                    //fixed zoom here
                    d3.zoomIdentity.x = MARGIN/2;
                    d3.zoomIdentity.y = window.scrollY + RADIUS/2 - y*scale;
                });

                d3.selectAll('.semimajorAxis')
                .transition()
                .duration(500)
                .style('stroke-width', strokeWidth)
                .on("start", () => console.log("Transition started")) // Check if transition starts
                .on("end", () => console.log("Transition ended")); // Check if transition completes
            }
        });
    })
    .catch(error => {
        console.error('Error fetching planet data:', error);
    });

/**
 * @param {String} englishName planet to find
 * @returns focused planet
 */
function findPlanet(englishName){
    let selectPlanet;

    planetData.map(planet => {
        d3.select(`.${planet.englishName.toLowerCase()}`)
        .attr('class', `${planet.englishName.toLowerCase()}`); //remove the focusPlanet class

        if(planet.englishName == englishName){
            selectPlanet = planet;
            d3.select(`.${englishName.toLowerCase()}`)
                .attr('class', `${englishName.toLowerCase()} focusPlanet`);
        } 
    })

    return selectPlanet;
}

/**
 * calculates the scale of within a range based on a radius
 * @param {Number} radius radius to base the scale on
 * @returns the scale 
 */
function calcScale(radius){
    const MAX_SCALE = 20,
     MIN_SCALE = 4;
    let diffScale = MAX_SCALE-MIN_SCALE;
    
    const MAX_RADIUS = SUNRADIUS,
    MIN_RADIUS = 5;
    let diffRadius = MAX_RADIUS-MIN_RADIUS;

    let percentage = radius/diffRadius;
    let scaleDelta = diffScale*percentage;

    return MAX_SCALE-scaleDelta;
}

function calcStrokeWidth(radius){
    const MAX_WIDTH = 1,
     MIN_WIDTH = 0.1;
    let diffWidth = MAX_WIDTH-MIN_WIDTH;
    
    const MAX_RADIUS = SUNRADIUS,
    MIN_RADIUS = 5;
    let diffRadius = MAX_RADIUS-MIN_RADIUS;

    let percentage = radius/diffRadius;
    let widthDelta = diffWidth*percentage;

    console.log(MIN_WIDTH+widthDelta);
    return MIN_WIDTH+widthDelta;
}