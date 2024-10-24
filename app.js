const searchInput = document.querySelector('#search');
const searchButton = document.querySelector('#btn');
const grid = document.querySelector('.grid');
const count = document.querySelector('.count');

async function retrieve (query, start){
    console.log(start);
    const data = await fetch(`https://www.googleapis.com/books/v1/volumes?maxResults=10&filter=paid-ebooks&startIndex=${start}&q=${query}`);
    const jsonData = await data.json();
    return jsonData
}

function s(array){
    if (array){
    let s = ''
    array.length === 1 ? s = '' : s = 's';
    return s;
    }
    return 's'
}

async function render (item){
    //create book element
    const book = document.createElement("div");
    grid.appendChild(book)
    book.id = item.id;
    book.classList.add('book');
    book.innerHTML = `  
    <img class="image">
    <div class="detail">
        <p class="title"></p>
        <p class="author">${item.volumeInfo.authors}</p>
        <p class="date"><b>Date Published: </b></p>
        <ul class = "categories">
        </ul>
    </div>
    `

    //add data to element
    const title = book.querySelector('.title')
    const date = book.querySelector('.date')
    const author = book.querySelector('.author');
    const image = book.querySelector('.image');
    const categories = book.querySelector('.categories')
    title.innerHTML += `<b>${item.volumeInfo.title.substring(0,50)}</b>` 
    author.innerHTML += item.volumeInfo.authors || 'N/A'
    date.innerHTML += item.volumeInfo.publishedDate || 'N/A'
    item.volumeInfo.imageLinks ? image.src = item.volumeInfo.imageLinks.thumbnail || 'N/A' : image.src = 'N/A'

    if (item.volumeInfo.categories){
    item.volumeInfo.categories.forEach((cat) => {
        const tag = document.createElement('li');
        categories.appendChild(tag);
        tag.innerHTML = cat;
    })
    }else{
        categories.innerHTML += `<li>N/A</li>`
    }

    book.addEventListener('click', function(){detail(book.id)});
}

async function detail(id){
    const data = await fetch('https://www.googleapis.com/books/v1/volumes/' + id);
    const item = await data.json();
    console.log(item);

    //add data to modal
    const title = info.querySelector('.title')
    const date = info.querySelector('.date')
    const author = info.querySelector('.author');
    const image = info.querySelector('.image');
    const categories = info.querySelector('.categories')
    const description = info.querySelector('.description')
    const pageCount = info.querySelector('.pagecount')
    const publisher = info.querySelector('.publisher')
    const saleLink = info.querySelector('.salelink')

    item.volumeInfo.title ? title.innerHTML = item.volumeInfo.title : title.innerHTML =  '';
    item.volumeInfo.authors ? author.innerHTML = item.volumeInfo.authors : author.innerHTML = '';
    item.volumeInfo.publishedDate? date.innerHTML = '<b>Date Published:</b> ' + item.volumeInfo.publishedDate : date.innerHTML = '';
    item.volumeInfo.imageLinks ? image.src = item.volumeInfo.imageLinks.thumbnail || 'N/A' : image.src = 'N/A';
    item.volumeInfo.description ? description.innerHTML = item.volumeInfo.description : description.innerHTML = 'N/A'
    item.volumeInfo.pageCount ? pageCount.innerHTML = '<b>Page Count: </b> ' + item.volumeInfo.pageCount : pageCount.innerHTML = '';
    item.volumeInfo.publisher ? publisher.innerHTML = '<b>Publisher: </b> ' + item.volumeInfo.publisher : publisher.innerHTML='';
    item.saleInfo.buyLink ? saleLink.href = item.saleInfo.buyLink :  saleLink.innerHTML = '';
    item.saleInfo.saleability === 'FREE' ? saleLink.innerHTML = 'Read Now' : saleLink.innerHTML = 'Buy Now £' + item.saleInfo.retailPrice.amount;

    categories.innerHTML = '';
    let i = 0;
    if (item.volumeInfo.categories){
        for (i = 0; i <= item.volumeInfo.categories.length && i <= 5; i++){
            const tag = document.createElement('li');
            categories.appendChild(tag);
            tag.innerHTML = item.volumeInfo.categories[i]
        }
    }else{
        categories.innerHTML=''
    }
    info.classList.remove('hidden')
}


function createModal (){
    const info = document.querySelector('#info')
    const modal = `
    <div class="container">
    <div class="close"><i class="fas fa-times"></i></div>
    <div class="sidebar">
        <img class="image">
        <p class="date"><b>Date Published: </b></p>
        <p class="publisher"><b>Publisher: </b></p>
        <p class="pagecount"><b>Page Count: </b></p>
        <ul class = "categories">
        <p><b>Categories:</b></p>
        </ul>
    </div>
    <div class="main">
        <h2 class="title"></h2>
        <em class="author"></em>
        <p class="description"></p>
    </div>
    <div class="footer">
        <a class="salelink" target="_blank">Buy Now</a>
    </div>
    </div>
`
    info.innerHTML = modal;
}


createModal();
const container = info.querySelector('.container')
const close = document.querySelector('.close');
close.addEventListener('click', function(){info.classList.add('hidden')})

searchButton.addEventListener('click', async function () {
    let data = await retrieve(searchInput.value, 0);
    books = data.items;
    grid.innerHTML = '';
    for (book of books){
        await render(book)
    }
    const loader = new Loader(document.querySelector('.loader'), grid.childNodes.length, data.totalItems);
});

class Loader {
    constructor(root, current, total) {
        this.root = root;
        this.currentItems = current;
        this.totalItems = total;
        this.root.innerHTML = '<button>Load More</button>'
        this.root.onclick = () => {this.load()}
        count.innerHTML = 'Showing ' + this.currentItems + ' of ' + this.totalItems;
    }

    load = async () => {
        const here = window.scrollY;
        let books = await retrieve(searchInput.value, grid.childNodes.length+1)
        books = books.items;
        for (book of books){
            await render(book)
        }
        this.currentItems = grid.childNodes.length
        count.innerHTML = 'Showing ' + this.currentItems + ' of ' + this.totalItems;
        window.scrollTo(0, here)
        if(this.currentItems <= this.totalItems){
            this.root.innerHTML = '<button>Load More</button>'
        }else{
            this.root.innerHTML = ''
        }
    }
}


