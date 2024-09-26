import banana from './banana-data.js';

const bananaStatCard = document.querySelector('.banana-stats');

function fillData(){
    //gets the key value pairs of the banaan object
    const bananaStats = Object.entries(banana);
    const ul = document.createElement('ul');
    bananaStats.map(stats =>{
        //stats[0] is the key
        //stats[1] is the value
        let stat = `
            <li>
                <p>${stats[0]}</p>
                <p>${stats[1]}</p>
            </li>
        `
        ul.innerHTML += stat;
    })
    bananaStatCard.appendChild(ul);
}

fillData();