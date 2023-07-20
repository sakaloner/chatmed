// config button
document.getElementById('config').addEventListener('click', async() => {
    chrome.tabs.create({url:'config.html'})
})
// chatmed button
document.getElementById('chatmed').addEventListener('click', async() => {
    chrome.tabs.create({url:'index.html'})
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
    const eventInput = new Event('input', { bubbles: true });
    const eventChange = new Event('change', { bubbles: true });

    console.log('filling-form')
    console.log('fields', fields)
    for (let {tid, text, name} of fields) {
        let element = document.querySelector(tid)
        console.log(tid, text, name)
        console.log('found element',)
        if (element) {
            // give a good class to the required
            if (element.required === true) {
                element.classList.add("ng-dirty", "ng-valid", "ng-valid-required")
                console.log('class_list', element.classList)
                console.log('elemento en cuestion', element)
            };
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
            };
            element.dispatchEvent(eventInput);
            element.dispatchEvent(eventChange);
        }
    }
}


