<script>
  import DrawingApp from "./DrawingApp.svelte";
  import Test from "./Test.svelte";

  const routes = {
    '/': Test,
    '/draw': DrawingApp
  }

  import Router from 'svelte-spa-router'
</script>


<Router {routes}/>