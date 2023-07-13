<script>
 let currentTabUrl;
 if (typeof currentTabUrl !== 'undefined') {
    currentTabUrl = localStorage.getItem('currentTabUrl');
 }
</script>
<div>
    <h3>nombre paciente</h3>
    <h3>Current Tab</h3><p>{currentTabUrl}</p>
</div>
