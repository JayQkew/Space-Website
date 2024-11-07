const colorContainer = document.querySelector('.color-container');
const fontContainer = document.querySelector('.font-container');
const fontSelect = document.querySelector('select');
const colors = [
    {
        HEX: "#FFC700",
        HSV: "(48, 100, 100)",
        temp: "hot"
    },
    {
        HEX: "#FFD600",
        HSV: "(53, 100, 100)",
        temp: "hot"
    },
    {
        HEX: "#FFA724",
        HSV: "(33, 85, 100)",
        temp: "hot"
    },
    {
        HEX: "#FF8A00",
        HSV: "(32, 100, 100)",
        temp: "hot"
    },
    {
        HEX: "#FF6813",
        HSV: "(17, 92, 100)",
        temp: "hot"
    },
    {
        HEX: "#FF6813",
        HSV: "(22, 93, 100)",
        temp: "hot"
    },
    {
      HEX: "#2BF2FF",
      HSV: "(186, 83, 100)",
      temp: "cold"
    },
    {
      HEX: "#2798FF",
      HSV: "(210, 84, 100)",
      temp: "cold"
    },
    {
      HEX: "#5F45FF",
      HSV: "(250, 73, 100)",
      temp: "cold"
    },
    {
      HEX: "#A95ACE",
      HSV: "(272, 56, 81)",
      temp: "cold"
    },
    {
      HEX: "#FFFFFF",
      HSV: "(0, 0, 100)",
      temp: "cold"
    },
    {
      HEX: "#050217",
      HSV: "(250, 88, 9)",
      temp: "cold"
    }
];

function createColors(colorArray){
    const colorCol = document.createElement('div');
    colorCol.classList.add('color-col');

    colorArray.map(c => {
        let tab = 
            `<div class="color-tab">
                <div class="color-sample" style="background-color: ${c.HEX};">
                    <p class="hex-val" style="color: ${(c.HEX === "#FFFFFF") ? '#050217' : '#FFFFFF'};">${c.HEX}</p>
                </div>
            </div>`;
        
        colorCol.innerHTML += tab;
    });
    

    colorContainer.appendChild(colorCol);
    let colorNodes = document.querySelectorAll('.color-sample');
    
    colorNodes.forEach(c => {
        c.addEventListener('click', () => {
            const hexValElem = c.querySelector('.hex-val');
            const hexVal = hexValElem.textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(hexVal).then(() => {
                hexValElem.textContent = "Copied";
                setTimeout(() => {
                    hexValElem.textContent = hexVal;
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        })

        c.addEventListener('mouseover', () =>{
            const hexValElem = c.querySelector('.hex-val');
            c.classList.add('focus');
            hexValElem.style.opacity = 1;
            setTimeout(() =>{
                c.classList.remove('focus');
                hexValElem.style.opacity = 0;
            }, 2500)
        })
    })
}

fontSelect.addEventListener('change', () => {
    const sampleText = document.querySelector('textarea');
    const sizeVal = document.querySelector('#size');
    const weightsVal = document.querySelector('#weight');
    const selectedFont = fontSelect.value;
    switch (selectedFont){
        case 'hero':
            sampleText.style.fontFamily = 'ClashDisplay-Hero';
            sampleText.style.fontSize = '7rem';
            sampleText.style.fontWeight = '700';
            sampleText.style.color = 'var(--titanium-white)';
            sampleText.style.letterSpacing = '0';
            sizeVal.innerText = '7rem';
            weightsVal.innerText  = '700';
            break;
        case 'heading':
            sampleText.style.fontFamily = 'ClashDisplay';
            sampleText.style.fontSize = '3rem';
            sampleText.style.fontWeight = '600';
            sampleText.style.color = 'var(--titanium-white)';
            sampleText.style.letterSpacing = '0';
            sizeVal.innerText = '3rem';
            weightsVal.innerText  = '600';
            break;
        case 'subheading':
            sampleText.style.fontFamily = 'ClashDisplay';
            sampleText.style.fontSize = '1.5rem';
            sampleText.style.fontWeight = '500';
            sampleText.style.color = 'var(--titanium-white)';
            sampleText.style.letterSpacing = '0';
            sizeVal.innerText = '1.5rem';
            weightsVal.innerText  = '500';
            break;
        case 'regular':
            sampleText.style.fontFamily = 'ClashDisplay';
            sampleText.style.fontSize = '1rem';
            sampleText.style.fontWeight = '400';
            sampleText.style.color = 'var(--titanium-white)';
            sampleText.style.letterSpacing = '0';
            sizeVal.innerText = '1rem';
            weightsVal.innerText  = '400';
            break;
        case 'banana':
            sampleText.style.fontFamily = 'Willful';
            sampleText.style.fontSize = '3rem';
            sampleText.style.fontWeight = '600';
            sampleText.style.color = 'var(--banana-yellow)';
            sampleText.style.letterSpacing = '0.25rem';
            sizeVal.innerText = '3rem';
            weightsVal.innerText  = '600';
            break;
    }
})


createColors(colors);