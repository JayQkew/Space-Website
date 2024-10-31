import banana from './banana-data.js';

const cardContainer = document.querySelector('.card-container');
const exploreBtn = document.querySelectorAll('.explore-btn');
const bananaStatCard = document.querySelector('.banana-stats');

const planetCards = [
    {
        svg: `<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6.98196" cy="6.40063" r="6.32064" fill="#A95ACE"/>
            </svg>`,
        planetName: 'Mars',
        planetFact: 'Radius: 3,389.5 km',
        scale: '31,000 football fields'
    },
    {
        svg: `<svg width="99" height="99" viewBox="0 0 99 99" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="49.4879" cy="49.4879" r="49.4879" fill="#FF8A00"/>
            </svg>`,
        planetName: 'Jupiter',
        planetFact: 'Mass: 1.898 × 10^27 kg',
        scale: '318 quadrillion elephants'
    },
    {
        svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9.65581" cy="9.65581" r="9.65581" transform="matrix(1 0 0 -1 0 19.3116)" fill="#FF6813"/>
            </svg>`,
        planetName: 'Venus',
        planetFact: 'Density: 5.24 g/cm³',
        scale: '5.24 times the density of water'
    }
];

function createPlanetCards(){
    planetCards.map(card =>{
        const svg = card.svg;
        const planetName = card.planetName;
        const planetFact = card.planetFact;
        const scale = card.scale;

        let content = `
            <article class="card">
                <div class="svg-container">
                ${svg}
                </div>
                <hgroup class="card-headings">
                    <h3>${planetName}</h3>
                    <p>${planetFact}</p>
                    <p>${scale}</p>
                </hgroup>
            </article>`

        cardContainer.innerHTML += content;
    });

    VanillaTilt.init(document.querySelectorAll('.card'),{
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        reverse: true
    });
}

exploreBtn.forEach(btn => btn.addEventListener('click', () =>{
    window.location.href = 'explore/explore.html';
}));


function fillBananaData(){
    //gets the key value pairs of the banaan object
    const bananaStats = Object.entries(banana);
    const ul = document.createElement('ul');
    bananaStats.map(stats =>{
        //stats[0] is the key
        //stats[1] is the value

        let unitOfMeasurement;

        switch(stats[0]){
            case 'mass':
                unitOfMeasurement = 'g';
                break;
            case 'length':
            case 'radius':
                unitOfMeasurement = 'cm';
                break;
            case 'volume':
                unitOfMeasurement = 'cm³';
                break;
            case 'density':
                unitOfMeasurement = 'g/cm³';
                break;
            default:
                unitOfMeasurement = '';
                break;
        }

        let stat = `
            <li>
                <p>${stats[0]}</p>
                <p>${stats[1]} ${unitOfMeasurement}</p>
            </li>
        `
        ul.innerHTML += stat;
    })
    bananaStatCard.appendChild(ul);
    VanillaTilt.init(document.querySelectorAll('.banana-card'),{
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        reverse: true
    });

    VanillaTilt.init(document.querySelector('.the-banana'),{
        max: 25,
        speed: 400,
        reverse: true
    });
}

fillBananaData();
createPlanetCards();
