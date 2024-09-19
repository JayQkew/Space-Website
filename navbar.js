const nav = document.querySelector('.navbar');
const currPage = document.querySelector('title').innerText;

const pages = [
    {page: 'Home', url: 'index.html'},
    {page: 'Explore', url: 'Explore/index.html'},
    {page: 'Design', url: 'Design/index.html'},
    {page: 'About', url: 'About/index.html'}
];

console.log(currPage);

function createNav(currPage){
    const list = document.createElement('ul');
    let allPages = '';

    pages.map( p => {
        let listItem;
        let url = `${(currPage == 'Home') ? '':'/'}${p.url}`;

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

        allPages += listItem;
    })

    list.innerHTML = allPages;
    nav.appendChild(list);
}

createNav(currPage);