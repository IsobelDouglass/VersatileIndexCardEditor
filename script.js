//import
const addFolderBtn = document.getElementById('add-folder-btn');
const addCardBtn = document.getElementById('add-card-btn');

const cardCounter = document.getElementById('card-counter');
let cardCount = 0;

const navList = document.querySelector('.nav-list');

const cards = document.querySelectorAll('.card');
const folders = document.querySelectorAll('.folder');

const container = document.querySelector('.container');

const page = document.querySelector('.main-content');

let itemsList = []

//generate id
function createNewId() {
    let id;
    do {
        id = Math.floor(Math.random() * 9000) + 1000;
    } while (itemsList.some((item) => item.id === id));
    return id;
}

//render page
function renderPage() {
    itemsList.forEach((item) => {
        if (item.type === 'card') {
            const newCard = document.createElement('div');
            newCard.setAttribute('class', 'card');
            newCard.setAttribute('data-card-id', item.id);
            newCard.innerHTML = `
                <h2 class="card-title">Card Title</h2>
                <div class="card-divider"></div>
                <p class="card-content">Card content goes here.</p>
            `;
            container.appendChild(newCard);
        }
        if (item.type === 'folder') {
            const newFolder = document.createElement('div');
            newFolder.className = 'folder';
            newFolder.dataset.folderId = item.id;
            newFolder.innerHTML = `
                <div class="folder-header">
                    <div class="mini-line-divider"></div>
                    <h2 class="folder-title">Folder Title</h2>
                    <div class="cont-main-line-divider"></div>
                </div>
            `;
            container.appendChild(newFolder);
        }
    });
}

//lock input text
document.addEventListener('blur', () => {
    if (
        //click off input
        ) saveToStorage();
});


//add new index card button + card counter
addCardBtn.addEventListener('click', () => {
    let newCard = document.createElement('div');
    let cardId = createNewId();
    newCard.setAttribute('class', 'card');
    newCard.setAttribute('data-card-id', cardId);
    newCard.innerHTML = `
        <h2 class="card-title">Card Title</h2>
        <div class="card-divider"></div>
        <p class="card-content">Card content goes here.</p>
    `;
    container.appendChild(newCard);

    const cardListing = document.createElement('li');
    cardListing.className = 'card-listing';
    cardListing.textContent = 'Card Title';
    navList.appendChild(cardListing);

    itemsList.push({ id: cardId, type: 'card' });

    cardCount++;
    cardCounter.textContent = cardCount;
}); 

//add new folder button
addFolderBtn.addEventListener('click', () => {
    const folderId = createNewId();
    const newFolder = document.createElement('div');
    newFolder.className = 'folder';
    newFolder.dataset.folderId = folderId;
    newFolder.innerHTML = `
    <div class="folder-header">
        <div class="mini-line-divider"></div>
        <h2 class="folder-title">Folder Title</h2>
        <div class="cont-main-line-divider"></div>
    </div>
    `;
    container.appendChild(newFolder);

    const folderListing = document.createElement('li');
    folderListing.className = 'folder-listing';
    folderListing.dataset.folderId = folderId;
    folderListing.textContent = 'Folder Title';
    navList.appendChild(folderListing);

    itemsList.push({ id: folderId, type: 'folder' });
});

//binder navigation

//hide / show navigator
/*navigatorBtn.addEventListener('click', () => {
    navList.classList.toggle('hidden');
});*/

//drag and drop functionality for index cards

/*
addAttribute("folder_id", "----")
*/

//drag and drop functionality for folders

//delete index card drag and drop

//delete folder drag and drop - prompt keep or delete index cards in folder option - modal / dialog

//edit index card on card

//edit index card in binder

//drag and drop in binder

//open index card