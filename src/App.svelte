<script>
  import Login from "./Login.svelte";
  import ConfirmEmail from "./ConfirmEmail.svelte";
  import Files from "./Files.svelte";
  import DrawingApp from "./DrawingApp.svelte";
  import ErrorPage from "./ErrorPage.svelte";


  import Router from 'svelte-spa-router'
    import ResetPassword from "./ResetPassword.svelte";

  const routes = {
    '/': Login,
    '/auth/confirm/:key': ConfirmEmail,
    '/auth/reset-password/:key': ResetPassword,
    '/files': Files,
    '/edit/:fileId?': DrawingApp,
    '/error/:statusCode?': ErrorPage,
    '*': ErrorPage
  }
</script>


<Router {routes}/>
