export default async function callapi(history) {
    let first_prompt = `
Soy médico general. Me ayudarás a diagnosticar y tratar a los pacientes que acuden a mi consulta. Por favor
dame varias opciones sobre las posibles causas de la enfermedad del paciente y los tratamientos. por favor no hables
sobre cómo el paciente debe recibir ayuda, ya que yo soy la ayuda.`

    let url = 'https://api.openai.com/v1/chat/completions'
    let data = {
        model:"gpt-3.5-turbo",
        messages:[{"role": "system", "content": first_prompt}]
    }
    data.messages.push(...history)
    console.log('history', history)
    console.log('new_data', data)
    let res = await fetch("https://api.openai.com/v1/chat/completions", {
        body: JSON.stringify(data),
        headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json"
        },
        method: "POST"
    });
    let res_n = await res.json()
    let final_res = res_n["choices"][0]["message"]
    return final_res
}
