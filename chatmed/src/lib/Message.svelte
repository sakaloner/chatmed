<script>
  export let message;
</script>

<div class="message {message.sender}">
  <p>{message.text}</p>
</div>

<style>
  .message {
    margin: 1em 0;
  }
  .message.user {
    text-align: right;
    color: blue;
  }
  .message.bot {
    text-align: left;
    color: red;
  }
</style>
