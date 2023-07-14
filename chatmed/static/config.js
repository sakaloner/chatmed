function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function createInput(id, value = '', placeholder = '') {
    let input = document.createElement('input');
    input.id = id;
    input.value = value;
    input.placeholder = placeholder;
    return input;
}

function createDeleteButton(parentElement) {

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    parentElement.appendChild(deleteButton);

    deleteButton.addEventListener('click', function() {
        let inputs = parentElement.querySelectorAll('input');
        let hasValue = Array.from(inputs).some(input => input.value !== '');
        if (hasValue && !confirm('Are you sure you want to delete this field?')) {
            return;
        }
        parentElement.remove();
    });
}

function createFieldDiv(field) {
    let div = document.createElement('div');
    div.className = 'field-div';
    div.appendChild(createInput('name', field.name, 'field name'));
    div.appendChild(createInput('tid', field.tid, 'tid'));
    div.appendChild(createInput('text', field.text, 'input text'));
    createDeleteButton(div);
    return div;
}

function createTemplateButtons(form, template, templates) {
    // Add field button
    let addFieldButton = document.createElement('button');
    addFieldButton.textContent = 'Add Field';
    addFieldButton.addEventListener('click', function(event) {
        event.preventDefault();
        form.appendChild(createFieldDiv({name: '', tid: '', text: ''}));
    });
    form.appendChild(addFieldButton);

    // Delete template button
    let deleteTemplateButton = document.createElement('button');
    deleteTemplateButton.textContent = 'Delete Template';
    deleteTemplateButton.addEventListener('click', function(event) {
        event.preventDefault()
        if (!confirm('Are you sure you want to delete this template?')) {
            return;
        }
        form.remove();
        // find the index
        let index = templates.findIndex(t => t.name === template.name);

        // If the template was found, remove it from the array
        if (index !== -1) {
            templates.splice(index, 1);
        }

        chrome.storage.sync.set({templates: templates}, () => {
            console.log('Template deleted');
        });
    });
    form.appendChild(deleteTemplateButton);

    // Save template button
    let saveTemplateButton = document.createElement('button');
    saveTemplateButton.textContent = 'Save Template';
    saveTemplateButton.addEventListener('click', function(event) {
        event.preventDefault();
        let fields = Array.from(form.querySelectorAll('.field-div')).map(div => {
            let nameInput = div.querySelector('#name');
            let idInput = div.querySelector('#tid');
            let textInput = div.querySelector('#text');
            return {name: nameInput.value, tid: idInput.value, text: textInput.value};
        });
        let templateTitle = form.querySelector('#template-title')
        let newTemplate = {templateId:form.id, name: templateTitle.value, fields: fields};
        console.log('form id', form.id, form)
        console.log(templateTitle.parentNode.id)
        chrome.storage.sync.get('templates', (data) => {
            let templates = data.templates;
            // If no templates exist, create a new array
            if (!templates) {
                templates = [];
            }
            // Check if a template with the same name already exists
            let existingTemplateIndex = templates.findIndex(t => t.templateId === newTemplate.templateId);

            if (existingTemplateIndex !== -1) {
                // If it exists, replace it
                templates[existingTemplateIndex] = newTemplate;
            } else {
                // If it doesn't exist, append the new template
                templates.push(newTemplate);
            }
            // Save the updated templates
            chrome.storage.sync.set({templates: templates}, () => {
                console.log('Template saved');
            });
        });
    });
    form.appendChild(saveTemplateButton);
}



function createTemplateForm(template, templates) {
    let form = document.createElement('form');
    let title = document.createElement('input');
    form.id = template.templateId
    form.className = 'template-form'
    title.value = template.name
    title.id = 'template-title'
    form.appendChild(title)

    createTemplateButtons(form, template, templates);

    for (let field of template.fields) {
        form.appendChild(createFieldDiv(field));
    }
    return form;
}


chrome.storage.sync.get('templates', (data) => {
    let templates = data.templates;
    let templatesDiv = document.getElementById('templates');

    // add template button
    let addTemplateButton = document.querySelector('#new-template')
    addTemplateButton.textContent = 'new templates'
    addTemplateButton.addEventListener('click', function(event) {
        let idGenerated = generateUniqueId();
        let newTemplate = {
            templateId:idGenerated,
            name: '',
            fields: [
                {name:'', tid:'', text:''}
            ]
        }
        templatesDiv.appendChild(createTemplateForm(newTemplate, templates))
    })

    for (let template of templates) {
        templatesDiv.appendChild(createTemplateForm(template, templates));
    }
});

// synquing stuff
let exportConfig = document.querySelector('#export-config')
exportConfig.addEventListener('click', function(event) {
    chrome.storage.sync.get('templates', (data) => {
        console.log('your config file', data.templates);
        alert('data sent to the console')
    })
})

let importConfig = document.querySelector('#import-config')
importConfig.addEventListener('click', function(event) {
    let userInput = prompt('Please enter your configuration:');
    console.log('user input', userInput)
    if (userInput) {
        console.log('theres user input')
        let templates = JSON.parse(userInput);
        chrome.storage.sync.set({templates: templates});
        location.reload(true)
    }
});

/*
[
    {
        "fields": [
            {
                "name": "peso",
                "text": "70",
                "tid": ".numberInputText.peso"
            },
            {
                "name": "frecuencia cardiaca",
                "text": "60",
                "tid": ".numberInputText.frecuenciaCardiaca"
            },
            {
                "name": "frecuencia respiratoria",
                "text": "16",
                "tid": ".numberInputText.frecuenciaRespiratoria"
            },
            {
                "name": "presion sistolica",
                "text": "120",
                "tid": ".numberInputText.presionSistolica"
            },
            {
                "name": "presion diastolica",
                "text": "80",
                "tid": ".numberInputText.presionDiastolica"
            },
            {
                "name": "revision sistema",
                "text": "Niega",
                "tid": ".isInputTextArea.proc-revisionsistema"
            },
            {
                "name": "estado general",
                "text": "- Patológicos: Niega\n- Medicamentos: Niega\n- Quirúrgicos: Niega\n- Alérgicos: Niega.\n- Toxicológicos: Niega\n- Familiares: Niega.\n- FUM: Hace menos de un mes\n- Citologia: Ya realizada en el último año, con resultado favorable\n- Mamografia:",
                "tid": ".isInputTextArea.estado-gral-paciente"
            },
            {
                "name": "analisis",
                "text": "Paciente cursando con sintomatologia sugestiva de - . Al examen fisico estable hemodinamicamente. Por lo anterior se indica - Se dan recomendaciones y signos de alarma para consultar a urgencias, el paciente comprende y acepta.",
                "tid": "#analisis-plan"
            },
            {
                "name": "diagnosito principal",
                "text": "Z719-CONSULTA, NO ESPECIFICADA",
                "tid": "#to-diagnostico-ppal"
            },
            {
                "name": "tipo diagnostico",
                "text": "Impresión diagnóstica",
                "tid": ".select.proc-tipoDiagnosticoPpal"
            }
        ],
        "name": "General Template",
        "templateId": "ljyqhkd5e5y7onzj2y"
    },
    {
        "fields": [
            {
                "name": "Enfermedad Actual",
                "text": "Paciente quien presenta cuadro clinico de evolución de 1 dia de dolor lumbar agudo tipo opresivo 9/10 en escala análoga del dolor, niega parestesias, niega pérdida de fuerza, niega fiebre, niega la levanta en la noche, niega trauma, niega antecedente de cancer, niega uso de drogas parenterales, niega uso cronico de corticoides; niega fiebre sudoración nocturna o perdida significativa de peso",
                "tid": ".isInputTextArea.proc-enfermedadactual"
            },
            {
                "name": "Motivo Consulta",
                "text": "Al paciente le duele la espalda un monton",
                "tid": ".isInputTextArea.proc-motivoconsulta"
            },
            {
                "name": "notas y analisis del plan",
                "text": "Paciente cursando con sintomatologia sugestiva de lumbago, sin signo de alarma. Al examen fisico estable hemodinamicamente, no deficit neurosensorial, lasegue negativo. Por lo anterior se indica analgesia, se ordena incapacidad, se dan recomendaciones (uso de compresas calientes, buena higiene de movimientos de columna) y signos de alarma para consultar a urgencias, el paciente comprende y acepta.",
                "tid": ".isInputTextArea.proc-ap-notasap"
            },
            {
                "name": "Dx principal",
                "text": "M545-LUMBAGO NO ESPECIFICADO",
                "tid": ".textInputAuto.proc-diagnosticoPpal"
            }
        ],
        "name": "Dolor Lumbar",
        "templateId": "ljyqhnqmlq5shldttb"
    },
    {
        "fields": [
            {
                "name": "Motivo Consulta",
                "text": "me duele la cabeza",
                "tid": ".isInputTextArea.proc-motivoconsulta"
            },
            {
                "name": "Enfermedad Actual",
                "text": "Paciente relata cuadro clinico de -- dias de evolución consistente en celfalea hemicraneana Derecha, asociado a su cuadro clinico refiere nausea, fonofobia y fotofobia. Refiere episodios parecidos durante su vida. Niega cefalea intensa de inicio subito, niega precipitación por esfuerzo fisico tos o cambio postural, niega convulsiones. ",
                "tid": ".isInputTextArea.proc-enfermedadactual"
            },
            {
                "name": "notas y analisis del plan",
                "text": "Paciente GENERO quien presenta cuadro clinico de cefalea de caracteristicas migrañosas. Estable hemodinamicamente, signos vitales dentro de la normalidad, sin aberración neurologia evidente al examen fisico. Se presume crisis migrañosa sin banderas rojas, por lo cual se ordena manejo sintomatico, se dan recomendaciones de cambios de estilo de vida (Realizar actividad cardiovascular minimo 20 min 3 veces a la semana, llevar diario de desencadenantes y evitarlos, consumir analgesico inmediatamente sienta los sintomas, llevar una dieta equilibra, entre otros). Adicionalmente se le explican los signos de alarma para consultar al servicio de urgencias. El paciente comprende y acepta",
                "tid": ".isInputTextArea.proc-ap-notasap"
            },
            {
                "name": "Dx",
                "text": "G439-MIGRAÑA, NO ESPECIFICADA",
                "tid": ".textInputAuto.proc-diagnosticoPpal"
            }
        ],
        "name": "Migraña",
        "templateId": "ljyr93ofj76edso8lq"
    },
    {
        "fields": [
            {
                "name": "Motivo Consulta",
                "text": "Cuadro de XX días Rinorrea hialina y congestión nasal comenta que mejora con reposo y empeora con la exposición ambientes fríos, húmedos y aires acondicionados, con predominio nocturno. Refiere se asocia a fiebre no cuantificada, malestar general, astenia, adinamia, refiere tos seca. Niega contacto estrecho con positivos o sospechosos de infección por COVID 19. Niega disnea, dolor torácico, niega síntomas gastrointestinales. Refiere que no se ha automedicado",
                "tid": ".isInputTextArea.proc-motivoconsulta"
            },
            {
                "name": "Enfermedad Actual",
                "text": "Paciente con antecedentes descritos, ahora cursando con cuadro sugestivo de rinofaringitis aguda de probable etiología viral. En el momento estable hemodinámicamente, sin signos de infección sistémica, sin signos de dificultad respiratoria o culaquier otro signo de alarma. Se ordena manejo ambulatorio sintomático, incapacidad. Se dan recomendaciones, signos de alarma, se resuelven dudas. Paciente dice que entiende y acepta.",
                "tid": ".isInputTextArea.proc-enfermedadactual"
            },
            {
                "name": "notas y analiss del plan",
                "text": "Paciente con antecedentes descritos, ahora cursando con cuadro sugestivo de rinofaringitis aguda de probable etiología viral. En el momento estable hemodinámicamente, sin signos de infección sistémica, sin signos de dificultad respiratoria o culaquier otro signo de alarma. Se ordena manejo ambulatorio sintomático, incapacidad. Se dan recomendaciones, signos de alarma, se resuelven dudas. Paciente dice que entiende y acepta.",
                "tid": ".isInputTextArea.proc-ap-notasap"
            },
            {
                "name": "Dx",
                "text": "J00X-RINOFARINGITIS AGUDA [RESFRIADO COMÚN]",
                "tid": ".textInputAuto.proc-diagnosticoPpal"
            }
        ],
        "name": "Gripa",
        "templateId": "ljyrlb6shgfkuu7vlbn"
    }
]
*/
