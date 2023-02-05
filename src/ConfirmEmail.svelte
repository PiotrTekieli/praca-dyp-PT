<script>
  import axios from "axios";
  import { link } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { ErrorToast, SuccessToast } from "./lib/Toasts";

  export let params = {}

  onMount(async () => {
    let response = (await axios.get(import.meta.env.VITE_HOSTURL + "/auth/confirm?key=" + params.key).catch(err => {
      ErrorToast("Something went wrong, please try again")
    }))
    console.log(response)
    if (response && response.status == 200)
      SuccessToast("Email confirmed!")
  })

</script>

<a href="/" use:link>Click to return to login page</a>