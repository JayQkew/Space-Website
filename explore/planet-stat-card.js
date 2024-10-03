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
        statCard.style.display = 'flex';
    }
    else{
        statCard.style.display = 'none';
    }
})

/**
 * creates the stat card for the current planet
 */
function createStatCard(){
    let focusPlanet = getFocusPlanet();

    let cardInnerHTML = `
        <div class="decorate-parent">
        <div class="star-decoration"><div class="star-wrapper"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C20.3795 19.3127 20.6874 19.6204 40 20C20.6874 20.3796 20.3795 20.6873 20 40C19.6205 20.6873 19.3129 20.3796 0 20C19.3129 19.6204 19.6205 19.3127 20 0Z" fill="white"></path>
        </svg></div><div class="line-decoration"></div></div>
            <h3 class="decorate">${focusPlanet.englishName}</h3>
        <div class="star-decoration"><div class="line-decoration"></div><div class="star-wrapper"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C20.3795 19.3127 20.6874 19.6204 40 20C20.6874 20.3796 20.3795 20.6873 20 40C19.6205 20.6873 19.3129 20.3796 0 20C19.3129 19.6204 19.6205 19.3127 20 0Z" fill="white"></path>
        </svg></div></div>
        </div>
            <div class="btn-container">
                <button class="banana-stat-btn">Banana</button>
                <button class="stat-btn">Regular</button>
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