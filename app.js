const searchInput = document.querySelector('#search')
const searchButton = document.querySelector('#btn')
const grid = document.querySelector('.grid')
const info = document.querySelector('#info')
const close = info.querySelector('.close')


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
    const jsonData = await data.json();
    info.classList.remove('hidden')
    console.log(jsonData);
}

close.addEventListener('click', function(){info.classList.add('hidden')})
searchButton.addEventListener('click', async function () {
    let books = await retrieve(searchInput.value);
    books = books.items
    grid.innerHTML = '';
    for (book of books){
        await render(book)
    }
});

