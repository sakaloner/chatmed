<script>
 import { onMount } from 'svelte';

 let currentTabUrl;
 onMount(()=> {
    currentTabUrl = localStorage.getItem('currentTabUrl');
    console.log('currentTabUrl', currentTabUrl)
 })
</script>
<div>
    <h3>nombre paciente</h3>
    <h3>Current Tab</h3><p>{currentTabUrl}</p>
</div>
