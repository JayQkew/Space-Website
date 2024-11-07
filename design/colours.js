const container = document.querySelector('.color-container');
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
const warmColors = colors.filter(c => c.temp === 'hot' );
const coolColors = colors.filter(c => c.temp === 'cold' );


function createColors(colorArray){
    const colorCol = document.createElement('div');
    colorCol.classList.add('color-col');

    colorArray.map(c => {
        let tab = 
            `<div class="color-tab">
                <d class="color-sample" style="background-color: ${c.HEX};"></d>
                <d class="color-values">
                    <p class="hex-val" style="color: ${(c.HEX === "#050217") ? '#FFFFFF' : c.HEX};">${c.HEX}</p>
                    <p class="hsv-val" style="color: ${(c.HEX === "#050217") ? '#FFFFFF' : c.HEX};">${c.HSV}</p>
                </d>
            </div>`;
        
        colorCol.innerHTML += tab;
    });
    

    container.appendChild(colorCol);
}

createColors(warmColors);
createColors(coolColors);