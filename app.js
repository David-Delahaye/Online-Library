const searchInput = document.querySelector('#search')
const searchButton = document.querySelector('#btn')
const grid = document.querySelector('.grid')

async function retrieve (query){
const data = await fetch('https://www.googleapis.com/books/v1/volumes?maxResults=20&q=' + query);
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
        <p class="author"><b>Author${s(item.volumeInfo.authors)}: </b></p>
        <p class="date"><b>Date Published: </b></p>
        <p><b>Categories:</b></p>
        <ul class = "categories">
        </ul>
        <button class = "learn">Learn More</button>
    </div>

    `

    //add data to element
    const title = book.querySelector('.title')
    const date = book.querySelector('.date')
    const author = book.querySelector('.author');
    const image = book.querySelector('.image');
    const categories = book.querySelector('.categories')
    const learn = book.querySelector('.learn')
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

    learn.addEventListener('click', function(){detail(book.id)});
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
    title.innerHTML = `<b>${item.volumeInfo.title}</b>` 
    author.innerHTML = item.volumeInfo.authors || 'N/A'
    date.innerHTML = '<b>Date Published:</b> ' + item.volumeInfo.publishedDate || ''
    item.volumeInfo.imageLinks ? image.src = item.volumeInfo.imageLinks.thumbnail || 'N/A' : image.src = 'N/A'
    description.innerHTML = item.volumeInfo.description || ''
    pageCount.innerHTML = '<b>Page Count: </b> ' + item.volumeInfo.pageCount || ''
    publisher.innerHTML = '<b>Publisher: </b> ' + item.volumeInfo.publisher || ''
    saleLink.href = item.saleInfo.buyLink || '#'

    categories.innerHTML = ''
    if (item.volumeInfo.categories){
        item.volumeInfo.categories.forEach((cat) => {
            const tag = document.createElement('li');
            categories.appendChild(tag);
            tag.innerHTML = cat;
        })
        }else{
            categories.innerHTML += `<li>N/A</li>`
        }

    info.classList.remove('hidden')
}


function createModal (){
    const info = document.querySelector('#info')
    const modal = `
    <div class="container">
    <div class="close">X</div>
    <div class="sidebar">
        <img class="image">
        <p class="date"><b>Date Published: </b></p>
        <p class="publisher"><b>Publisher: </b></p>
        <p class="pagecount"><b>Page Count: </b></p>
        <p><b>Categories:</b></p>
        <ul class = "categories">
        </ul>
        <a class="salelink" target="_blank">Buy Now</a>
    </div>
    <div class="main">
        <h2 class="title"></h2>
        <em class="author"></em>
        <p class="description"></p>
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
    let books = await retrieve(searchInput.value);
    books = books.items
    grid.innerHTML = '';
    for (book of books){
        await render(book)
    }
});

