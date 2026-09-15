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

//render page — only called on initial load, rebuilds from itemsList
function renderPage() {
    itemsList.forEach((item) => {
        if (item.type === 'card') {
            const newCard = document.createElement('div');
            newCard.setAttribute('class', 'card');
            newCard.setAttribute('data-card-id', item.id);
            newCard.innerHTML = `
                <h2 class="card-title" contenteditable="true">${item['card-title'] ?? 'Card Title'}</h2>
                <div class="card-divider"></div>
                <p class="card-content" contenteditable="true" data-placeholder="Card content goes here.">${item['card-content'] ?? ''}</p>
            `;
            container.appendChild(newCard);

            const cardListing = document.createElement('li');
            cardListing.className = 'card-listing';
            cardListing.dataset.cardId = item.id;
            cardListing.setAttribute('contenteditable', 'true');
            cardListing.textContent = item['card-title'] ?? 'Card Title';
            navList.appendChild(cardListing);
        }
        if (item.type === 'folder') {
            const newFolder = document.createElement('div');
            newFolder.className = 'folder';
            newFolder.dataset.folderId = item.id;
            newFolder.innerHTML = `
                <div class="folder-header">
                    <div class="mini-line-divider"></div>
                    <h2 class="folder-title" contenteditable="true">${item['folder-title'] ?? 'Folder Title'}</h2>
                    <div class="cont-main-line-divider"></div>
                </div>
            `;
            container.appendChild(newFolder);

            const folderListing = document.createElement('li');
            folderListing.className = 'folder-listing';
            folderListing.dataset.folderId = item.id;
            folderListing.setAttribute('contenteditable', 'true');
            folderListing.textContent = item['folder-title'] ?? 'Folder Title';
            navList.appendChild(folderListing);
        }
    });
}

//save current card/folder text into itemsList and persist to localStorage
function saveToStorage() {
    itemsList.forEach((item) => {
        if (item.type === 'card') {
            const cardEl = container.querySelector(`.card[data-card-id="${item.id}"]`);
            if (cardEl) {
                item['card-title'] = cardEl.querySelector('.card-title').textContent;
                item['card-content'] = cardEl.querySelector('.card-content').textContent;
            }
        }
        if (item.type === 'folder') {
            const folderEl = container.querySelector(`.folder[data-folder-id="${item.id}"]`);
            if (folderEl) {
                item['folder-title'] = folderEl.querySelector('.folder-title').textContent;
            }
        }
    });
    localStorage.setItem('indexCardsData', JSON.stringify(itemsList));
}

//load saved cards/folders from localStorage
function loadFromStorage() {
    const saved = localStorage.getItem('indexCardsData');
    if (!saved) return;

    itemsList = JSON.parse(saved);

    //one-time cleanup: cards saved before the placeholder feature existed have the
    //old default text stored literally — clear it so the CSS placeholder shows again
    itemsList.forEach((item) => {
        if (item.type === 'card' && item['card-content'] === 'Card content goes here.') {
            item['card-content'] = '';
        }
    });

    renderPage();

    cardCount = itemsList.filter((item) => item.type === 'card').length;
    cardCounter.textContent = cardCount;
    saveToStorage();
}

//keeps a card/folder's title in sync with its binder listing, whichever side was just edited
document.addEventListener('focusout', (e) => {
    const target = e.target;

    if (target.matches('.card-title')) {
        const cardId = target.closest('.card').dataset.cardId;
        const listing = navList.querySelector(`.card-listing[data-card-id="${cardId}"]`);
        if (listing) listing.textContent = target.textContent;
    } else if (target.matches('.folder-title')) {
        const folderId = target.closest('.folder').dataset.folderId;
        const listing = navList.querySelector(`.folder-listing[data-folder-id="${folderId}"]`);
        if (listing) listing.textContent = target.textContent;
    } else if (target.matches('.card-listing')) {
        const cardId = target.dataset.cardId;
        const cardTitle = container.querySelector(`.card[data-card-id="${cardId}"] .card-title`);
        if (cardTitle) cardTitle.textContent = target.textContent;
    } else if (target.matches('.folder-listing')) {
        const folderId = target.dataset.folderId;
        const folderTitle = container.querySelector(`.folder[data-folder-id="${folderId}"] .folder-title`);
        if (folderTitle) folderTitle.textContent = target.textContent;
    } else {
        return;
    }

    saveToStorage();
});

//single-line title fields: Enter exits editing instead of inserting a line break
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('.card-title, .folder-title')) {
        e.preventDefault();
        e.target.blur();
    }
});

//strip line breaks from pasted text in single-line title fields
document.addEventListener('paste', (e) => {
    if (!e.target.matches('.card-title, .folder-title')) return;
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData)
        .getData('text/plain')
        .replace(/[\r\n]+/g, ' ');
    document.execCommand('insertText', false, text);
});


//add new index card button + card counter
addCardBtn.addEventListener('click', () => {
    const cardId = createNewId();
    const title = 'Card Title';
    const content = '';

    const newCard = document.createElement('div');
    newCard.setAttribute('class', 'card');
    newCard.setAttribute('data-card-id', cardId);
    newCard.innerHTML = `
        <h2 class="card-title" contenteditable="true">${title}</h2>
        <div class="card-divider"></div>
        <p class="card-content" contenteditable="true" data-placeholder="Card content goes here.">${content}</p>
    `;
    container.appendChild(newCard);

    const cardListing = document.createElement('li');
    cardListing.className = 'card-listing';
    cardListing.dataset.cardId = cardId;
    cardListing.setAttribute('contenteditable', 'true');
    cardListing.textContent = title;
    navList.appendChild(cardListing);

    itemsList.push({
        id: cardId,
        'parent-id': null,
        type: 'card',
        'indent-count': 0,
        'card-title': title,
        'card-content': content,
        'page-content': null
    });

    cardCount++;
    cardCounter.textContent = cardCount;
    saveToStorage();
});

//add new folder button
addFolderBtn.addEventListener('click', () => {
    const folderId = createNewId();
    const title = 'Folder Title';

    const newFolder = document.createElement('div');
    newFolder.className = 'folder';
    newFolder.dataset.folderId = folderId;
    newFolder.innerHTML = `
    <div class="folder-header">
        <div class="mini-line-divider"></div>
        <h2 class="folder-title" contenteditable="true">${title}</h2>
        <div class="cont-main-line-divider"></div>
    </div>
    `;
    container.appendChild(newFolder);

    const folderListing = document.createElement('li');
    folderListing.className = 'folder-listing';
    folderListing.dataset.folderId = folderId;
    folderListing.setAttribute('contenteditable', 'true');
    folderListing.textContent = title;
    navList.appendChild(folderListing);

    itemsList.push({
        id: folderId,
        'parent-id': null,
        type: 'folder',
        'indent-count': 0,
        'folder-title': title,
        'folder-content': []
    });
    saveToStorage();
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

//load any saved cards/folders on page start
loadFromStorage();