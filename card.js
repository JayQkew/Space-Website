const cardContainer = document.querySelector('.card-container');

const planetCards = [
    {
        img: 'mars.jpg',
        planetName: 'Mars',
        planetFact: 'Radius: 3,389.5 km',
        scale: '31,000 football fields'
    },
    {
        img: 'jupiter.jpg',
        planetName: 'Jupiter',
        planetFact: 'Mass: 1.898 × 10^27 kg',
        scale: '318 quadrillion elephants'
    },
    {
        img: 'venus.jpg',
        planetName: 'Venus',
        planetFact: 'Density: 5.24 g/cm³',
        scale: '5.24 times the density of water'
    }
];

function createCard(){
    planetCards.map(card =>{
        const img = card.img;
        const planetName = card.planetName;
        const planetFact = card.planetFact;
        const scale = card.scale;

        let content = `
            <article class="card">
                <img src="${img}" alt="${planetName}">
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