//get data
const url = 'https://api.le-systeme-solaire.net/rest/bodies/'
const planetData = fetch(url)
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
        const planetsAndSun = celestialBodies.filter(body => body.isPlanet || body.englishName === 'Sun');

        console.log(planetsAndSun);
    })
    .catch(error => {
        console.error('Error fetching planet data:', error);
    });