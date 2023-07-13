<script>
  import Message from './Message.svelte';
  let input = '';
  let messages = [
    {sender: 'bot', text: 'Hello! How can I help you today?'}
  ];
  function handleSubmit() {
      messages = [...messages, {sender: 'user', text: input}];
      input = '';
  }
</script>

<div class="chat-window">
  {#each messages as message (message.text)}
    <Message {message} />
  {/each}
</div>
<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={input} placeholder="Type your message here..." />
  <button type="submit">Send</button>
</form>

<style>
  .chat-window {
    height: 400px;
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
