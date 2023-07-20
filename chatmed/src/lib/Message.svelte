<script>
  export let message;
</script>

<div class="message {message.role}">
  <p>{message.content}</p>
</div>

<style>
  .message {
    white-space:pre-wrap;
    margin: 1em 0;
    font-size:18px;
  }
  .message.user {
    text-align: right;
    color: blue;
  }
  .message.assistant {
    text-align: left;
    color: red;
  }

</style>
