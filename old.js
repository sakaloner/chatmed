chrome.storage.sync.get('templates', (data) => {
    console.log('data in storage',data)
    let templates = data.templates

    // Display the template
    let templatesDiv = document.getElementById('templates');
    for (let template of templates) {
        let form = document.createElement('form');
        form.id = 'main-form'
        form.textContent = template.name
        templatesDiv.appendChild(form)
        // add fields of the form
        for (let field of template.fields) {
            let divo = document.createElement('div')
            divo.className = 'field-div'
            form.appendChild(divo)
            let fieldName = document.createElement('input');
            fieldName.value = field.name
            fieldName.id = 'name';
            divo.appendChild(fieldName)
            let idInput = document.createElement('input');
            idInput.type = 'text';
            idInput.value = field.id;
            idInput.id = 'id';
            divo.appendChild(idInput);
            let textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.value = field.text;
            textInput.id = 'text';
            divo.appendChild(textInput);

            // delete button
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            divo.appendChild(deleteButton);
            // Add an event listener to the delete button
            deleteButton.addEventListener('click', function() {
                // Check if any of the input fields have values
                let inputs = divo.querySelectorAll('input');
                let hasValue = Array.from(inputs).some(input => input.value !== '');
                // If any input fields have values, show a confirmation alert
                if (hasValue && !confirm('Are you sure you want to delete this field?')) {
                    return;  // If the user cancels the confirmation, do nothing
                }
                // Remove the div
                divo.remove();
            });
        }
        // template specific buttons
        let templateButtons = document.createElement('div')
        form.appendChild(templateButtons)

        // Save template
        let saveTemplate = document.createElement('button')
        saveTemplate.textContent = 'Save Template'
        templateButtons.appendChild(saveTemplate);
        saveTemplate.addEventListener('click', () => {
            // get the fields
            let divs = document.querySelectorAll('.field-div')
            console.log('query selector dfields', divs)
            let fields = []
            for (let div of divs){
                let field = {}
                let isEmptyValue = false;

                for (let tag of div.children) {
                    console.log('tag', tag)
                    if (tag.tagName.toLowerCase() === 'button'){
                        continue
                    }
                    if (tag.value === '') {
                        isEmptyValue = true;
                        break
                    }
                    field[tag.id] = tag.value
                }
                if (isEmptyValue) {
                    continue;
                }
                fields.push(field)
            }
            console.log('fields final', fields)
            let template = {
                name: 'New Template',
                fields: fields
            };
            // Add input fields for the template...
            chrome.storage.sync.get('templates', (data) => {
                let templates = data.templates;
                // If no templates exist, create a new array
                if (!templates) {
                    templates = [];
                }
                // Append the new template
                templates.push(template);
                // Save the updated templates
                chrome.storage.sync.set({templates: templates}, () => {
                    console.log('Template saved');
                });
            });
        });

        // add field
        let addField = document.createElement('button')
        addField.textContent = 'add field'
        templateButtons.appendChild(addField)
        addField.addEventListener('click', () => {
            let divo = document.createElement('div')
            divo.className = 'field-div'
            form.appendChild(divo)
            let fieldName = document.createElement('input');
            fieldName.value = fieldName.name
            fieldName.id = 'name'
            fieldName.placeholder = 'field name'
            divo.appendChild(fieldName)
            let idInput = document.createElement('input');
            idInput.type = 'text';
            idInput.placeholder = 'id';
            idInput.id = 'id'
            divo.appendChild(idInput);
            let textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.id = 'text';
            textInput.placeholder = 'input text';
            divo.appendChild(textInput);
            // delete button
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            divo.appendChild(deleteButton);

            // Add an event listener to the delete button
            deleteButton.addEventListener('click', function() {
                // Check if any of the input fields have values
                let inputs = divo.querySelectorAll('input');
                let hasValue = Array.from(inputs).some(input => input.value !== '');

                // If any input fields have values, show a confirmation alert
                if (hasValue && !confirm('Are you sure you want to delete this field?')) {
                    return;  // If the user cancels the confirmation, do nothing
                }

                // Remove the div
                divo.remove();
            });
        });

        // Delete template
        let deleteTemplate = document.createElement('button')
        deleteTemplate.textContent = 'delete template'
        templateButtons.appendChild(deleteTemplate)

        // Add an event listener to the delete template button
        deleteTemplate.addEventListener('click', function() {
            // Check if any of the fields in the template have values
            let fields = form.querySelectorAll('.field-div');
            let hasValue = Array.from(fields).some(field => {
                let inputs = field.querySelectorAll('input');
                return Array.from(inputs).some(input => input.value !== '');
            });

            // If any fields have values, show a confirmation alert
            if (hasValue && !confirm('Are you sure you want to delete this template?')) {
                return;  // If the user cancels the confirmation, do nothing
            }

            // Remove the template from the page
            form.remove();

            // Remove the template from the templates array
            let index = templates.indexOf(template);
            if (index !== -1) {
                templates.splice(index, 1);
            }

            // Save the updated templates array to chrome.storage.sync
            chrome.storage.sync.set({templates: templates}, () => {
                console.log('Template deleted');
            });
        });
    }
});
