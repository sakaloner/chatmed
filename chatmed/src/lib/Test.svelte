<script>
 async function callapi() {
    let url = 'https://api.openai.com/v1/chat/completions'
    let data = {
        model:"gpt-3.5-turbo",
        messages:[{"role": "system", "content": "You are a helpful assistant."}]
    }
    let res = await fetch("https://api.openai.com/v1/chat/completions", {
        body: JSON.stringify(data),
        headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json"
        },
        method: "POST"
    });
    let res_n = await res.json()
    console.log('res_n', res_n["choices"][0]["message"])
    return res_n

 }
</script>
<button on:click={callapi}>Send req</button>
