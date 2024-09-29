import banana from './banana-data.js';

const bananaStatCard = document.querySelector('.banana-stats');

function fillData(){
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
}

fillData();