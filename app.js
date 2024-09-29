const nav = document.querySelector('.navbar');
const currPage = document.querySelector('title').innerText;
const exploreBtn = document.querySelector('.explore-btn');

const pages = [
    {page: 'Home', url: 'index.html'},
    {page: 'Explore', url: 'explore/explore.html'},
    {page: 'Design', url: 'design/design.html'},
    {page: 'About', url: 'about/about.html'}
];

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
        let url = `${(currPage == 'Home') ? '':'../'}${p.url}`;   // manages the folder hierarchy for the url

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

function decoratePage(){
    const decorateElements = document.querySelectorAll('.decorate');
    Array.from(decorateElements).map(element =>{
        element.parentElement.classList.add('decorate-parent');
        addDecoration('left', element);
        addDecoration('right', element);
    })
}

if(window.location.href == '../index.html'){
    exploreBtn.addEventListener('click', () =>{
        window.location.href = 'explore/explore.html';
    })
}

createNav(currPage);
decoratePage();