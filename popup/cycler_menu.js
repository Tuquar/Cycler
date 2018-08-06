var cyclerData = null;

var cyclerList = document.querySelector('#cyclerList');
var linkInput = document.querySelector('#siteInput');;
var nickNameInput = document.querySelector('#nicknameInput');
var saveButton = document.querySelector('#saveButton');

saveButton.addEventListener('click', async (event) => {
    toggleSaveState();
    var link = linkInput.value;
    var nickname = nickNameInput.value;

    cyclerData.list.push({
        nickname,
        link
    });

    browser.storage.local.set(cyclerData)
        .then(updateLinks, onError)
        .then(clearInputs)
        .then(toggleSaveState);
});

function clearInputs(){
    linkInput.value = '';
    nickNameInput.value = '';
}

function toggleSaveState() {
    linkInput.disabled = !linkInput.disabled;
    nickNameInput.disabled = !nickNameInput.disabled;
    saveButton.disabled = !saveButton.disabled;
}

function updateLinks(){
    cyclerList.innerHTML = '';
    for(let count = 0; count < cyclerData.list.length; count++){
        let li = document.createElement('li');
        let link = document.createElement('a');
        link.text = cyclerData.list[count].nickname;
        link.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            changeURL(cyclerData.list[count].link);
        });
        link.href = link;
        li.appendChild(link);
        
        cyclerList.appendChild(li);
    }
}

async function changeURL(link){
    let tabs = await browser.tabs.query({currentWindow: true});
    for(let tab of tabs){
        if(tab.active){
            browser.tabs.update( tab.id, { url: link });
        }
    }
}

function onError(error){
    console.error(error);
}

async function retrieveLinks() {
    var defaultData = {
        list: [],
    }
    toggleSaveState();
    var retrievedData = await browser.storage.local.get('cyclerData');
    toggleSaveState();
    if(retrievedData.list){
        console.log('Found valid data');
        cyclerData = retrievedData;
    }
    console.log('No valid data found, starting with empty list');
    cyclerData = defaultData;
}

retrieveLinks();
