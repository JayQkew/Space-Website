import { getFocusPlanet } from "./render-solarsystem.js";

export const statCard = document.querySelector('.planet-stats-card');


const STATMODE_BANANA = 'banana',
    STATMODE_REGULAR = 'regular';
let statMode = STATMODE_REGULAR;

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

/**
 * creates the stat card for the current planet
 */
export function createStatCard(){
    let focusPlanet = getFocusPlanet()

    statCard.innerHTML = `
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
    const bananaStatBtn = document.querySelector('.banana-stat-btn');
    const statBtn = document.querySelector('.stat-btn');

    //changes the stat mode to banana
    bananaStatBtn.addEventListener('click', () =>{
        statMode = STATMODE_BANANA;
        updateStats(focusPlanet);
    })
    
    //changes the stat mode to regular
    statBtn.addEventListener('click', () =>{
        statMode = STATMODE_REGULAR;
        updateStats(focusPlanet);
    })

    addStats(focusPlanet);
}

/**
 * adds the stats to the planetStatCard
 * @param {Array} focusPlanet 
 */
function addStats(focusPlanet){
    let ul = document.createElement('ul');
    statTypes.map(stat => {
        let li = `
            <li>
                <span class="stat-key">${stat.name}</span>
                <span class="stat-value" data-type="${stat.type}">${statCheck(focusPlanet, stat)}</span>
            </li>
        `
        ul.innerHTML += li;
        
    });

    statCard.appendChild(ul);
}

function updateStats(focusPlanet){
    let statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(s => {
        // Find the matching stat object using the data-type attribute
        let statType = s.getAttribute('data-type');
        let stat = statTypes.find(st => st.type == statType);

        if (stat) {
            s.innerHTML = statCheck(focusPlanet, stat);
        } else {
            console.error(`Stat type "${statType}" not found in statTypes.`);
            s.innerHTML = 'N/A';
        }
    });
}


/**
 * gets the value for each stat type
 * @param {Array} focusPlanet 
 * @param {any} stat stat type
 * @returns 
 */
function statCheck(focusPlanet, stat){
    if(typeof focusPlanet[stat.type] == 'object'){
        if(stat.type === 'mass'){
            if (statMode === STATMODE_REGULAR){
                return focusPlanet[stat.type].massValue + ' x 10<sup>' + focusPlanet[stat.type].massExponent +'</sup> <span class="units">' + stat.unit + '</span>';
            }
            else{
                return calcBananas(focusPlanet, stat);
            }
        }
        else{
            if (statMode === STATMODE_REGULAR){
                return focusPlanet[stat.type].volValue + ' x 10<sup>' + focusPlanet[stat.type].volExponent + '</sup> <span class="units">' + stat.unit + '</span>';
            }
            else{
                return calcBananas(focusPlanet, stat);
            }
        }
    }
    else{
        if (statMode === STATMODE_REGULAR){
            return focusPlanet[stat.type] + ' <span class="units">' + stat.unit + '</span>';
        }
        else{
            return calcBananas(focusPlanet, stat);
        }
    }
}

function calcBananas(focusPlanet, stat) {
    switch (stat.type) {
        case 'mass':
            // Assuming the average banana mass is 120 grams (0.12 kg)
            const bananaMass = 0.12; // kg
            let massInBananas = focusPlanet.mass.massValue * Math.pow(10, focusPlanet.mass.massExponent) / bananaMass;
            return massInBananas.toLocaleString() + ' <span class="banana-word">bananas</span>';

        case 'semimajorAxis':
            // Assuming the average length of a banana is 20 cm (0.2 meters or 0.0002 km)
            const bananaLength = 0.0002; // km
            let axisInBananas = focusPlanet.semimajorAxis / bananaLength;
            return axisInBananas.toLocaleString() + ' <span class="banana-word">bananas</span>';

        case 'meanRadius':
            // Assuming a banana’s average radius (width) is 2 cm (0.02 meters or 0.00002 km)
            const bananaRadius = 0.00002; // km
            let radiusInBananas = focusPlanet.meanRadius / bananaRadius;
            return radiusInBananas.toLocaleString() + ' <span class="banana-word">bananas</span>';

        case 'vol':
            // Assuming the volume of a banana is approximately 0.115 liters (0.000115 km^3)
            const bananaVolume = 0.000115; // km^3
            let volInBananas = focusPlanet.vol.volValue * Math.pow(10, focusPlanet.vol.volExponent) / bananaVolume;
            return volInBananas.toLocaleString() + ' <span class="banana-word">bananas</span>';

        case 'density':
            // Assuming the density of a banana is 0.94 g/cm^3 (since bananas are slightly less dense than water)
            const bananaDensity = 0.94; // g/cm^3
            let densityInBananas = focusPlanet.density / bananaDensity;
            return densityInBananas.toFixed(2) + ' <span class="banana-word">bananas</span>';

        default:
            return 'N/A';
    }
}

