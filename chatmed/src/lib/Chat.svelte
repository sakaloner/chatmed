<script>
  import Message from './Message.svelte';
  import callapi from '../utils/openai.js'
  let input = '';
  let messages = [
    {role: 'assistant', content: 'Hola, como puedo ayudarte hoy?'}
  ];

  async function handleSubmit () {
    messages = [...messages, {role: 'user', content: input}];
    input = '';
    messages = [...messages, {role: 'assistant', content: '...'}];
    let msg_minus = messages.slice(0, messages.length-1)
    console.log('messages to send', msg_minus)
    let res = await callapi(msg_minus)
    messages.pop()
    console.log('res', res, res['content'])
    messages = [...messages, {role:'assistant', content:res['content']}]
  }
</script>

<div class="chat-window">
  {#each messages as message, index (index)}
    <Message {message} />
  {/each}
</div>


<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={input} placeholder="Type your message here..." />
  <button type="submit">Send</button>
</form>


<style>
  .chat-window {
    height: 100%;
    overflow-y: auto;
    border: 1px solid black;
    padding: 1em;
    margin-bottom: 1em;
  }
  form {
    display: flex;
    justify-content: space-between;
  }
  input {
    flex-grow: 1;
    margin-right: 1em;
  }
</style>
