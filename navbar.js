const nav = document.querySelector('.navbar');
const currPage = document.querySelector('title').innerText;

const pages = [
    {page: 'Home', url: 'index.html'},
    {page: 'Explore', url: 'explore/index.html'},
    {page: 'Design', url: 'design/index.html'},
    {page: 'About', url: 'about/index.html'}
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
        let url = `${(currPage == 'Home') ? '':'/'}${p.url}`;   // manages the folder hierarchy for the url

        // ensures the the current page doesnt have a hyperlink
        if(p.page == currPage){
            listItem = `
                <li>
                    <a class="activeNav">${p.page}</a>
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
function addDecoration(side){
    const decoration = document.createElement('div');
    const starSVG = document.createElement('svg');
    const line = document.createElement('div');
    
    decoration.appendChild(side === 'left' ? starSVG : line);
    decoration.appendChild(side === 'left' ? line : starSVG);
}

createNav(currPage);