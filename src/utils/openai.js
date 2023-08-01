import 'dotenv/config'
export default async function callapi(history, isGPT4) {
    let first_prompt = `
Soy médico general. Me ayudarás a diagnosticar y tratar a los pacientes que acuden a mi consulta. Por favor
dame varias opciones sobre las posibles causas de la enfermedad del paciente y los tratamientos.
Se conciso y por favor no escribas cosas como esta al final pues me hace perder tiempo valioso que podria
usar ayudando a mis pacientes:
"Se recomienda consultar a un médico especialista en osteoporosis para una evaluación detallada y un plan de tratamiento personalizado."
o "Recuerda que estos son posibles diagnósticos, pero siempre se debe realizar una evaluación clínica completa."`

    let url = 'https://api.openai.com/v1/chat/completions'
    let data = {
        model:isGPT4 ? "gpt-4":"gpt-3.5-turbo",
        messages:[{"role": "system", "content": first_prompt}]
    }
    data.messages.push(...history)
    console.log('history', history)
    console.log('new_data', data)
    let res = await fetch("https://api.openai.com/v1/chat/completions", {
        body: JSON.stringify(data),
        headers: {
            Authorization: "Bearer process.env.PUBLIC_OPENAI_API_KEY",
            "Content-Type": "application/json"
        },
        method: "POST"
    });
    let res_n = await res.json()
    let final_res = res_n["choices"][0]["message"]
    return final_res
}
