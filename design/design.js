const wireframeArticle = document.querySelector('.wireframes');

const wireframes = [
    {
        pageName: "Home Page",
        description: "Users are welcomed by an inspiring hero section featuring a quote from Carl Sagan, inviting them to explore the site’s ideas.<br> As they scroll, a data narrative unfolds through a sequence of engaging statements, gradually immersing them in the site’s purpose and content. This approach not only guides users intuitively but also deepens their curiosity and connection to the story the site aims to tell.",
        midFid: "/images/Home Page-mid-fid.png",
        highFid: "/images/Home Page-high-fid.png",
        midAlt: "Mid-fidelity wireframe for the Home Page",
        highAlt: "High-fidelity wireframe for the Home Page"
    },
    {
        pageName: "Explore Page",
        description: "This is a brief description of the design.",
        midFid: "/images/Explore Page-mid-fid.png",
        highFid: "/images/Explore Page-high-fid.png",
        midAlt: "Mid-fidelity wireframe for the Explore Page",
        highAlt: "High-fidelity wireframe for the Explore Page"
    },
    {
        pageName: "Design Page",
        description: "This is a brief description of the design.",
        midFid: "/images/Design Page-mid-fid.png",
        highFid: "/images/Design Page-high-fid.png",
        midAlt: "Mid-fidelity wireframe for the Design Page",
        highAlt: "High-fidelity wireframe for the Design Page"
    },
    {
        pageName: "About Page",
        description: "This is a brief description of the design.",
        midFid: "/images/About Page-mid-fid.png",
        highFid: "/images/About Page-high-fid.png",
        midAlt: "Mid-fidelity wireframe for the About Page",
        highAlt: "High-fidelity wireframe for the About Page"
    }
];

/**
 * creates the html code for the wireframes and alternates the
 * image and description depending if its an odd or even child
 */
function createWireframes(){
    wireframes.map( w => {
        let section = document.createElement('section');
        section.classList.add('page-section');

        let wireframeType = `
        <div class="wireframe-type">
            <h3 class="wireframe-label">Mid-fidelity</h3>
        </div>`;

        let wireframeSlides = `
        <div class="wireframe-slides">
            <div class="wireframe-wrapper">
                <img src="${w.midFid}" alt="${w.midAlt}" class="wireframe-img mid-fid showing">
                <img src="${w.highFid}" alt="${w.highAlt}" class="wireframe-img high-fid">
            </div>
            <div class="slide-indicator">
                <div class="slide-icon focus-icon" id="mid-fid"></div>
                <div class="slide-icon" id="high-fid"></div>
            </div>
        </div>`

        let container = document.createElement('div');
        container.classList.add('wireframe-img-container');
        container.innerHTML = wireframeType + wireframeSlides;

        let description = `
        <div class="wireframe-description">
            <h3>${w.pageName}</h3>
            <p>${w.description}</p>
        </div>`

        section.appendChild(container);
        section.innerHTML += description;

        wireframeArticle.appendChild(section);
    })
}

function addSliderEvents(){
    let sliders = document.querySelectorAll('.slide-icon');
    sliders.forEach(s => {
        let wireframeWrapper = s.parentElement.parentElement.children[0];
        s.addEventListener('click', () => {
            Array.from(s.parentElement.children).forEach(c => {
                c.classList.remove('focus-icon');
            });
            console.log('clicked here!');
            s.classList.add('focus-icon');

            if(s.id === 'mid-fid'){
                wireframeWrapper.querySelector('.mid-fid').classList.add('showing');
                wireframeWrapper.querySelector('.mid-fid').style.display = 'block';
                wireframeWrapper.querySelector('.high-fid').classList.remove('showing');
                wireframeWrapper.querySelector('.high-fid').style.display = 'none';
            }
            else{
                wireframeWrapper.querySelector('.mid-fid').classList.remove('showing');
                wireframeWrapper.querySelector('.mid-fid').style.display = 'none';
                wireframeWrapper.querySelector('.high-fid').classList.add('showing');
                wireframeWrapper.querySelector('.high-fid').style.display = 'block';
            }
        })
    })
}

function removeImageDisplay(){

}

createWireframes();
addSliderEvents();