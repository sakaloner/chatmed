// config button
document.getElementById('config').addEventListener('click', async() => {
    chrome.tabs.create({url:'config.html'})
})
// chatmed button
function getFormValues (data) => {
    let finalArray = [];
    data.forEach(item => {
        item.fields.forEach(field => {
            console.log(field.name, field.text, field.tid);
            let input = document.getElementById(field.tid)
            if (input.value) {
                let dicto = {}
                dicto[field.name] = input.value
                finalArray.push(dicto)
            }
        });
    });
    console.log('final array', finalArray)
    return finalArray;
}

document.getElementById('chatmed').addEventListener('click', async() => {
    fetch('formInputs.json') // replace 'data.json' with the path to your JSON file
        .then(response => response.json())
        .then(data => {
            let patientInfo = getFormValues(data);
            localStorage.setItem('PatientInfo', patientInfo);
            chrome.tabs.create({url:'index.html'})
        });
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

