const url = 'https://api.le-systeme-solaire.net/rest/bodies/';
let planetData;
/**
 * fetches the data from the API and caches it.
 * @returns planet data fetched from solar API
 */
async function fetchPlanetData(){
    try{
        const response = await fetch(url);
        if(!response.ok) throw new Error('Issue with API');

        const data = await response.json();
        const planets = data.bodies;

        planetData = planets.filter(body => body.isPlanet || body.englishName === 'Sun');

        return planetData;
    }
    catch(error){
        console.error('Error fetching planet data:', error);
        return null;
    }
}

/**
 * Gets the planet data and fetches data if not already cached.
 * @returns {Promise<Array>} a promise for the planetData
 */
export async function getPlanetData(){
    if(!planetData){
        return await fetchPlanetData();
    }
    return planetData;
}