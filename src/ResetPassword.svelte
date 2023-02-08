<script>
  import axios from 'axios';
  import { link, push } from 'svelte-spa-router'
  import { onMount } from 'svelte';
  import { checkToken } from './lib/checkToken';
  import { ErrorToast, InfoToast, SuccessToast } from './lib/Toasts';

  export let params = {}

  let newPassword
  let repeatPassword
  let resetButton

  let key = params.key


  async function AttemptLogin() {
    if (!newPassword && !repeatPassword)
      return ErrorToast("Please input a new password")

    if (newPassword != repeatPassword)
      return ErrorToast("Passwords do not match")

    let loginResponse = (await axios.post(import.meta.env.VITE_HOSTURL + "/auth/reset-password?key=" + key, { password: newPassword }).catch(err => {
      if (err.response)
        ErrorToast(err.response.data.message)
      else
        ErrorToast()
    }))

    if (loginResponse && loginResponse.status == 200) {
      SuccessToast(loginResponse.data.message)
      push("/")
    }
  }

  function checkEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault()
        resetButton.click()
    }
  }

</script>

<div id="background"></div>

<div id="mainWindow">
  <div class="header">Password Reset</div>

  <div class="label">New Password</div>
  <input class="input-style" type="password" bind:value={newPassword} on:keypress={checkEnter}/>
  <div class="label">Repeat New Password</div>
  <input class="input-style" type="password" bind:value={repeatPassword} on:keypress={checkEnter}/>

  <div class="loginContainer" style="margin-top: 12px;">
    <br>

    <button bind:this={resetButton} on:click={AttemptLogin} class="primary-button">Reset Password</button>
  </div>
</div>

<style>
  #background {
    background-color: var(--darkerColor);
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  #mainWindow {
    background-color: var(--mainColor);
    width: 420px;
    height: fit-content;
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    border-radius: 4px;
    padding: 24px 48px;
    padding-bottom: 36px;
    box-sizing: border-box;
    flex-grow: 0;
    flex-shrink: 0;
  }

  #mainWindow::before {
    content: "Drawing App";
    position: absolute;
    left: 50%;
    top: -20%;
    translate: -50% -50%;
    font-size: 3rem;
    width: max-content;
  }

  .header {
    width: 100%;
    text-align: center;
    font-size: 20px;
    margin: 4px;
  }

  .label {
    padding: 4px;
  }

  #mainWindow input {
    width: 100%;
    height: 30px;
    margin-bottom: 24px;
  }

  #mainWindow .loginContainer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>