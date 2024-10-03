const bananaData = {
    mass: 120,       // Average mass in grams
    length: 18,      // Average length in centimeters
    radius: 2.5,     // Average radius in centimeters
    volume: 118,     // Approximate volume in cubic centimeters
    density: 0.96,   // Approximate density in g/cm³
};

/**
 * converts data to a higher metric system
 * @param {Number} data data to convert
 * @param {String} currUnit unit of that data
 */
export function unitConversion(data, currUnit){
    if(currUnit === 'g'){
        //to kg
        return data/1000;
    }
    else if(currUnit === 'cm'){
        //to km
        return data/100000;
    }
    else if(currUnit === 'cm3'){
        //to km^3
        return data/1000000000000000;
    }

    return console.log(`${currUnit} doesnt need conversion`)
}

export default bananaData;