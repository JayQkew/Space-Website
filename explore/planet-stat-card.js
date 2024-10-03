import { fetchPlanetData, getFocusPlanet } from "./solar-system-dv.js";
import bananaData from "../banana-data.js";

let statCard = document.querySelector('.planet-stats-card');

const statTypes = [
    {
        type: 'mass',
        name: 'Mass',
        unit: 'kg'
    },
    {
        type: 'semimajorAxis',
        name: 'Semi-major Axis',
        unit: 'km'
    },
    {
        type: 'meanRadius',
        name: 'Radius',
        unit: 'km'
    },
    {
        type: 'vol',
        name: 'Volume',
        unit: 'km<sup>3</sup>'
    },
    {
        type: 'density',
        name: 'Density',
        unit: 'g.cm<sup>3</sup>'
    }
]

window.addEventListener('scroll', () => {
    if (window.scrollY >= 755){
        createStatCard();
    }
})

/**
 * creates the stat card for the current planet
 */
function createStatCard(){
    let focusPlanet = getFocusPlanet();

    let cardInnerHTML = `
            <h3>${focusPlanet.englishName}</h3>
            <div class="btn-container">
                <button class="banana-btn">Banana</button>
                <button>Regular</button>
            </div>
    `

    statCard.innerHTML = cardInnerHTML;

    addStats(focusPlanet);
}


function addStats(focusPlanet){
    let ul = document.createElement('ul');
    statTypes.map(stat => {
        let statType = stat.type;
        let li = `
            <li>
                <span class="stat-key">${stat.name}</span>
                <span class="stat-value">${statCheck(focusPlanet, stat)}</span>
            </li>
        `
        ul.innerHTML += li;
        
        console.log(typeof focusPlanet[stat.type])
    });

    statCard.appendChild(ul);
}

function statCheck(focusPlanet, stat){
    if(typeof focusPlanet[stat.type] == 'object'){
        if(stat.type === 'mass'){
            return focusPlanet[stat.type].massValue + ' x 10<sup>' + focusPlanet[stat.type].massExponent +'</sup> ' + stat.unit;
        }
        else{
            return focusPlanet[stat.type].volValue + ' x 10<sup>' + focusPlanet[stat.type].volExponent + '</sup> ' + stat.unit;
        }
    }
    else{
        return focusPlanet[stat.type] + ' ' + stat.unit;
    }
}