const nav = document.querySelector('.navbar');
const footer = document.querySelector('footer');
const currPage = document.querySelector('title').innerText;
const body = document.querySelector('body');

const pages = [
    {page: 'Home', url: 'index.html'},
    {page: 'Explore', url: 'explore/explore.html'},
    {page: 'Design', url: 'design/design.html'},
    {page: 'About', url: 'about/about.html'}
];

function setBackground() {
    const randNum = Math.floor(Math.random() * 4);

    // Set the background images (SVG + random Space image)
    document.body.style.backgroundImage = `
        url("data:image/svg+xml;base64,ICAgICAgICA8c3ZnICB3aWR0aD0iMTAwdnciIGhlaWdodD0iMTAwdmgiPgogICAgICAgICAgICA8ZmlsdGVyIGlkPSJub2lzZS1maWx0ZXIiPgogICAgICAgICAgICAgICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjEuMyI+PC9mZVR1cmJ1bGVuY2U+CiAgICAgICAgICAgIDwvZmlsdGVyPgogICAgICAgICAgICA8cmVjdCB3aWR0aD0iMTAwdnciIGhlaWdodD0iMTAwdmgiIGZpbHRlcj0idXJsKCNub2lzZS1maWx0ZXIpIj48L3JlY3Q+"), 
        url('/images/Space${randNum}.png')`;

    // Apply background settings
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
}

/**
 * creates a 'ul' of links to other pages of the website
 * the url's are declared in the 'pages' array using objects
 * @param {String} currPage the current page the user is on
 */
function createNav(currPage){
    const list = document.createElement('ul');
    list.classList.add('decorate');
    let allPages = '';
    pages.map( p => {
        let listItem;
        let url = `${(currPage == 'Home') ? './':'../'}${p.url}`;   // manages the folder hierarchy for the url

        // ensures the the current page doesnt have a hyperlink
        if(p.page == currPage){
            listItem = `
                <li>
                    <a class="active-nav">${p.page}</a>
                </li>
            `;
        }
        else{
            listItem = `
                <li>
                    <a href=${url}>${p.page}</a>
                </li>
            `;
        }

        // appends it to the string of all the pages
        allPages += listItem;
    })
    // adds the string as HTML to the 'ul'
    list.innerHTML = allPages;
    nav.appendChild(list);

}

/**
 * creates the footer for every page
 */
function createFooter(){
    footer.innerHTML = `
        <article class="footer-content">
            <section class="footer-section about">
                <h3>About This Project</h3>
                <p>
                    This project explores the wonders of our solar system using a banana for scale. Developed as part of a school project, it combines art, data visualization, and a passion for space.
                </p>
            </section>
    
            <section class="footer-section contact">
                <h3>Contact</h3>
                <ul>
                    <li>GitHub: <a href="https://github.com/jayqkew" target="_blank">JayQkew</a></li>
                    <li>LinkedIn: <a href="https://www.linkedin.com/in/jay-lee-shih-236742291" target="_blank">My LinkedIn</a></li>
                </ul>
            </section>
        </article>
    
        <div class="footer-bottom">
            <p>&copy; 2024 Space Webiste | Designed by Jay-Lee Shih. All Rights Reserved.</p>
        </div>
    `
}

/**
 * creates the decorative elements of the navbar
 * @param {String} side left or right side of the navbar
 * @param {Node} node node to decorate around 
 */
function addDecoration(side, node){
    const decoration = document.createElement('div');
    decoration.classList.add('star-decoration');

    const starSVG =  `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C20.3795 19.3127 20.6874 19.6204 40 20C20.6874 20.3796 20.3795 20.6873 20 40C19.6205 20.6873 19.3129 20.3796 0 20C19.3129 19.6204 19.6205 19.3127 20 0Z" fill="white"/>
        </svg>`

    const starWrapper = document.createElement('div');
    starWrapper.classList.add('star-wrapper');
    starWrapper.innerHTML = starSVG;

    const line = document.createElement('div');
    line.classList.add('line-decoration');

    // appends the elements in a specific order depending on the 'side'
    decoration.appendChild(side === 'left' ? starWrapper : line);
    decoration.appendChild(side === 'left' ? line : starWrapper);

    // appends into DOM before (left) 'ul' using 'insertBefore'
    // appends into DOM after (right) 'ul' using 'appendChild'
    (side === 'left') ? node.parentElement.insertBefore(decoration,node) : node.parentElement.appendChild(decoration);
}

/**
 * decorates all elements that have the 'decorate' class
 */
function decoratePage(){
    const decorateElements = document.querySelectorAll('.decorate');
    Array.from(decorateElements).map(element =>{
        element.parentElement.classList.add('decorate-parent');
        addDecoration('left', element);
        addDecoration('right', element);
    })
}

//setBackground();
createNav(currPage);
createFooter();
decoratePage();