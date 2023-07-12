// config button
document.getElementById('config').addEventListener('click', async() => {
    console.log('clicked config')
    chrome.tabs.create({url:'config.html'})
})
// create buttons
chrome.runtime.sendMessage({action: 'getTemplates'}, async (response) => {
    let templates = response.templates;
    console.log('templates', templates)
    let buttonsDiv = document.querySelector('#template-buttons-div')
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    for (let template of templates){
        let tempButton = document.createElement('button')
        tempButton.textContent = template.name
        buttonsDiv.appendChild(tempButton)
        // make it fill the page
        tempButton.addEventListener('click', async() => {
            console.log('clicked filling button')
            let fields = template.fields
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: fillForm,
                args: [fields]
            }, (results) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                } else if (results && results[0].error) {
                    console.error(results[0].error);
                }
            });

        })
    }
});

function fillForm(fields) {
    console.log('filling-form')
    console.log('fields', fields)
    for (let {tid, text, name} of fields) {
        let element = document.querySelector(tid)
        console.log(tid, text, name)
        console.log('found element',)
        if (element) {
            if (element.tagName === 'SELECT') {
                for (let option of element.options) {
                    //maybe we gotta change to text content
                    if (option.text === text) {
                        option.selected = true;
                        break;
                    }
                }
            } else {
                let numText = Number(text)
                if (!isNaN(numText)) {
                    console.log('setting the new value')
                    element.value = numText;
                } else {
                    console.log('setting the new value text')
                    element.value = text;
                }
            }
        }
    }
}

