const nav = document.querySelector('.navbar');
const currPage = document.querySelector('title').innerText;

const pages = [
    {page: 'Home', url: 'index.html'},
    {page: 'Explore', url: 'explore/explore.html'},
    {page: 'Design', url: 'design/design.html'},
    {page: 'About', url: 'about/about.html'}
];

console.log(currPage);

/**
 * creates a 'ul' of links to other pages of the website
 * the url's are declared in the 'pages' array using objects
 * @param {String} currPage the current page the user is on
 */
function createNav(currPage){
    const list = document.createElement('ul');
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
 */
async function addDecoration(side){
    const decoration = document.createElement('div');
    decoration.classList.add('star-decoration');

    // gets the 'svg' from the svgs file
    let url = `${(currPage == 'Home') ? '':'../'}svgs/Star-small.svg`;
    const starSVG = await fetch(url)
        .then(response => response.text());

    const starWrapper = document.createElement('div');
    starWrapper.classList.add('star-wrapper');

    const line = document.createElement('div');
    line.classList.add('line-decoration');
    
    starWrapper.innerHTML = starSVG;

    // appends the elements in a specific order depending on the 'side'
    decoration.appendChild(side === 'left' ? starWrapper : line);
    decoration.appendChild(side === 'left' ? line : starWrapper);

    // appends into DOM before (left) 'ul' using 'insertBefore'
    // appends into DOM after (right) 'ul' using 'appendChild'
    (side === 'left') ? nav.insertBefore(decoration,nav.querySelector('ul')) : nav.appendChild(decoration);
}

createNav(currPage);
addDecoration('left');
addDecoration('right');