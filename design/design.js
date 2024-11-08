const wireframeArticle = document.querySelector('.wireframes');

const wireframes = [
    {
        pageName: "Home Page",
        description: "Users are welcomed by an inspiring hero section featuring a quote from Carl Sagan, inviting them to explore the site’s ideas.<br> As they scroll, a data narrative unfolds through a sequence of engaging statements, gradually immersing them in the site’s purpose and content. This approach not only guides users intuitively but also deepens their curiosity and connection to the story the site aims to tell.",
        midFid: "../images/Home Page-mid-fid.png",
        highFid: "../images/Home Page-high-fid.png",
        midAlt: "Mid-fidelity wireframe for the Home Page",
        highAlt: "High-fidelity wireframe for the Home Page"
    },
    {
        pageName: "Explore Page",
        description: "This page presents a captivating data visualization that immerses users in a cosmic experience. Using the Solar System API, the planets are scaled for distance, with adjustments made to the sizes to maintain relevance and perspective, given the Sun's vast size compared to even the largest planet (Jupiter). This interactive visualization lets users explore and compare various planetary metrics by adjusting the forces acting on each celestial body, adding a dynamic and immersive element to the experience.",
        midFid: "../images/Explore Page-mid-fid.png",
        highFid: "../images/Explore Page-high-fid.png",
        midAlt: "Mid-fidelity wireframe for the Explore Page",
        highAlt: "High-fidelity wireframe for the Explore Page"
    },
    {
        pageName: "Design Page",
        description: "The design page provides insight into the creative process and thought behind the website’s visual and functional elements. Wireframes reveal the iterative development of each page, while the style sheet breaks down each component and the design rationale. Additionally, the theory section highlights the research conducted on data visualization principles, informing the site's overall approach.",
        midFid: "../images/Design Page-mid-fid.png",
        highFid: "../images/Design Page-high-fid.png",
        midAlt: "Mid-fidelity wireframe for the Design Page",
        highAlt: "High-fidelity wireframe for the Design Page"
    },
    {
        pageName: "About Page",
        description: "This page offers a look into my background and the inspiration behind creating this website.",
        midFid: "../images/About Page-mid-fid.png",
        highFid: "../images/About Page-high-fid.png",
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

/**
 * adds the swap slides events to the slider icons
 */
function addSliderEvents(){
    let sliders = document.querySelectorAll('.slide-icon');
    sliders.forEach(s => {
        let wireframeWrapper = s.parentElement.parentElement.children[0];
        let type = s.parentElement.parentElement.parentElement.children[0];
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

                type.children[0].textContent = 'Mid-fidelity';
            }
            else{
                wireframeWrapper.querySelector('.mid-fid').classList.remove('showing');
                wireframeWrapper.querySelector('.mid-fid').style.display = 'none';
                wireframeWrapper.querySelector('.high-fid').classList.add('showing');
                wireframeWrapper.querySelector('.high-fid').style.display = 'block';

                type.children[0].textContent = 'High-fidelity';
            }
        })
    })
}

/**
 * rotates between slides at a set interval
 * @param {Number} interval seconds between each interval
 */
function rotateBetweenSlides(interval) {
    const sections = document.querySelectorAll('.page-section');
    
    sections.forEach(section => {
        let isHovered = false;

        // Add hover listeners to each section
        section.addEventListener('mouseenter', () => isHovered = true);
        section.addEventListener('mouseleave', () => isHovered = false);

        setInterval(() => {
            // Skip rotation if the user is hovering over the section
            if (isHovered) return;

            const midFid = section.querySelector('.mid-fid');
            const highFid = section.querySelector('.high-fid');
            const typeLabel = section.querySelector('.wireframe-label');
            const midIcon = section.querySelector('#mid-fid');
            const highIcon = section.querySelector('#high-fid');

            if (midFid.classList.contains('showing')) { // Switch to high-fidelity
                midFid.classList.remove('showing');
                midFid.style.display = 'none';
                highFid.classList.add('showing');
                highFid.style.display = 'block';
                
                typeLabel.textContent = 'High-fidelity';
                midIcon.classList.remove('focus-icon');
                highIcon.classList.add('focus-icon');
            } else { // Switch to mid-fidelity
                highFid.classList.remove('showing');
                highFid.style.display = 'none';
                midFid.classList.add('showing');
                midFid.style.display = 'block';

                typeLabel.textContent = 'Mid-fidelity';
                highIcon.classList.remove('focus-icon');
                midIcon.classList.add('focus-icon');
            }
        }, interval*1000);
    });
}

createWireframes();
addSliderEvents();
rotateBetweenSlides(7);

VanillaTilt.init(document.querySelectorAll('.wireframe-wrapper'),{
    max: 5,
    speed: 400,
    reverse: true
});