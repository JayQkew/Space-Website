const wireframeArticle = document.querySelector('.wireframes');

const wireframes = [
    {
        pageName: "Home Page",
        description: "This is a brief description of the design.",
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
        let imgContainer = `
        <div class="wireframe-img-container">
            <div class="wireframe-wrapper">
                <img src="${w.midFid}" alt="${w.midAlt}" class="wireframe-img mid-fid">
            </div>
            <div class="wireframe-wrapper focus">
                <img src="${w.highFid}" alt="${w.highAlt}" class="wireframe-img high-fid focus">
            </div>
        </div>`;

        let descriptionContainer =`
        <div class="wireframe-description">
            <h3>${w.pageName}</h3>
            <p>${w.description}</p>
        </div>`

        let section = document.createElement('section');
        section.classList.add('page-section');

        if(wireframeArticle.childElementCount % 2 !== 0) section.innerHTML = imgContainer + descriptionContainer;
        else section.innerHTML = descriptionContainer + imgContainer;

        wireframeArticle.appendChild(section);
    })
}

function addWireframeEvents(){
    let wrappers = wireframeArticle.querySelectorAll('.wireframe-wrapper');

    wrappers.forEach(w => {
        w.addEventListener('mouseenter', () => {
            Array.from(w.parentElement.children).forEach( c => {
                c.classList.remove('focus');
                c.children[0].classList.remove('focus')
            });
            w.classList.add('focus');
            w.children[0].classList.add('focus');
        })
    })
}

createWireframes();
addWireframeEvents();