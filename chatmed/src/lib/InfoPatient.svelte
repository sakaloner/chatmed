<script>
 import { onMount } from 'svelte';

 let currentTabUrl;
 onMount(()=> {
    currentTabUrl = localStorage.getItem('currentTabUrl');
    console.log('currentTabUrl', currentTabUrl)
 })
</script>
<div>
    <h1>ChatMed</h1>
</div>
