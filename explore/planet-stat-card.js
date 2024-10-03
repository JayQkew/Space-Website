import { fetchPlanetData } from "./solar-system-dv.js";

let planetData = fetchPlanetData()
    .then(data =>{
        return data;
    });

console.log(planetData);