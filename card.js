const cardContainer = document.querySelector('.card-container');

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

function createCard(){
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
                </hgroup>
                <p>${scale}</p>
            </article>        
        `

        cardContainer.innerHTML += content;
    });
}

createCard();