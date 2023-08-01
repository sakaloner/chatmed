function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

let generalTemplate =
    {
        templateId: generateUniqueId(),
        name: "General Template",
        fields: [
            {name:'peso', text:"70", tid:".numberInputText.peso"},
            {name:'frecuencia cardiaca', text:"60", tid:".numberInputText.frecuenciaCardiaca"},
            {name:'frecuencia respiratoria', text:"16", tid:".numberInputText.frecuenciaRespiratoria"},
            {name:'presion sistolica', text:"120", tid:".numberInputText.presionSistolica"},
            {name:'presion diastolica', text:"80", tid:".numberInputText.presionDiastolica"},

            /// revision sistemas
            {name:'revision sistema', text:"Niega", tid:".isInputTextArea.proc-revisionsistemas"},
            // antecedentes generales
            {
                name:'estado general',
                text: "- Patológicos: Niega\n- Medicamentos: Niega\n- Quirúrgicos: Niega\n- Alérgicos: Niega.\n- Toxicológicos: Niega\n- Familiares: Niega.\n- FUM: Hace menos de un mes\n- Citologia: Ya realizada en el último año, con resultado favorable\n- Mamografia:",
                tid: ".isInputTextArea.estado-gral-paciente"
            },

            // analisis y plan
            {name:'analisis',tid:"#analisis-plan", text:"Paciente cursando con sintomatologia sugestiva de - . Al examen fisico estable hemodinamicamente. Por lo anterior se indica - Se dan recomendaciones y signos de alarma para consultar a urgencias, el paciente comprende y acepta."},
            // diagnostigo
            {name:'diagnosito principal', tid:"#to-diagnostico-ppal", text:"Z719-CONSULTA, NO ESPECIFICADA"},
            {name:'tipo diagnostico', text:"Impresión diagnóstica", tid:".select.proc-tipoDiagnosticoPpal"},
        ]
    }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTemplates') {
        chrome.storage.local.get('templates', (data) => {
            console.log('data', data)
            console.log('templates', data.templates)
            if (!data.templates || data.templates.length == 0) {
                console.log('no data templates')
                let templates = [generalTemplate];
                chrome.storage.local.set({templates: templates}, () => {
                    console.log('Default template saved');
                });
                sendResponse({templates: templates});
                console.log('sent data', templates)
            } else {
                console.log('theres data templates')
                console.log('send data', data.templates)
                sendResponse({templates: data.templates});
            }
        });
        return true;  // Indicates that we will send a response asynchronously
    }
});
