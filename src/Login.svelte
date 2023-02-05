<script>
  import axios from 'axios';
  import { link, push } from 'svelte-spa-router'
  import { onMount } from 'svelte';
  import { checkToken } from './lib/checkToken';
  import { ErrorToast, SuccessToast } from './lib/Toasts';

  let registerView = false

  let username
  let password
  let loginButton

  let registerUsername
  let registerPassword
  let email
  let registerButton

  onMount(async () => {
    if ((await checkToken()))
      push("/files")
  })

  async function AttemptLogin() {
    let loginResponse = (await axios.post(import.meta.env.VITE_HOSTURL + "/auth/login", { username: username, password: password }).catch(err => {
      ErrorToast(err.response.data.message)
    }))

    if (loginResponse && loginResponse.status == 200) {
      SuccessToast(loginResponse.data.message)
      localStorage.setItem("token", loginResponse.data.token)
      push("/files")
    }
  }

  async function AttemptSignup() {
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]+$/.test(email))
      return ErrorToast("Invalid email address")

    let signupResponse = (await axios.post(import.meta.env.VITE_HOSTURL + "/auth/signup", { username: registerUsername, email: email, password: registerPassword }).catch(err => {
      ErrorToast(err.response.data.message)
    }))

    console.log(signupResponse)
    if (signupResponse && signupResponse.status == 201)
      SuccessToast("Account creation successful! Please confirm your email")
  }

  function checkEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      if (!registerView)
        loginButton.click()
      else
        registerButton.click()
    }
  }

  function toggleRegisterView() {
    registerView = !registerView
  }
</script>

<div id="background"></div>

<div id="mainWindow">
  {#if !registerView}
    <div class="header">Login</div>

    <div class="label">Username</div>
    <input bind:value={username} on:keypress={checkEnter}/>
    <div class="label">Password</div>
    <input type="password" bind:value={password} on:keypress={checkEnter}/>

    <a href="/#">Forgot Password</a>

    <div class="loginContainer" style="margin-top: 12px;">
      <a href="/#" on:click={toggleRegisterView}>Create an Account</a>

      <button bind:this={loginButton} on:click={AttemptLogin} class="primary-button">Login</button>
    </div>
  {:else}
    <div class="header">Register Account</div>

    <div class="label">Username</div>
    <input bind:value={registerUsername} on:keypress={checkEnter}/>

    <div class="label">Password</div>
    <input type="password" bind:value={registerPassword} on:keypress={checkEnter}/>

    <div class="label">Email</div>
    <input bind:value={email} on:keypress={checkEnter}/>

    <div class="loginContainer">
      <a href="/#" on:click={toggleRegisterView}>Login</a>

      <button bind:this={registerButton} on:click={AttemptSignup} class="primary-button">Register</button>
    </div>
  {/if}
  <span class="guestLink">
    <span class="explainGuest">
      ?
      <span class="tooltip">Allows you to move directly to the editor, however you will not be able to save your progress on the server.</span>
    </span>
    <a href="/edit/" use:link>Continue as Guest</a>
  </span>
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

  #mainWindow a {
    color: var(--fontColor);
    text-decoration: none;
    margin: 16px 0;
  }

  #mainWindow a:hover {
    text-decoration: underline;
  }

  #mainWindow input {
    width: 100%;
    height: 30px;
    margin-bottom: 24px;
    box-sizing: border-box;
    color: var(--fontColor);
    background-color: var(--darkerColor);
    border: none;
    border-bottom: 1px var(--fontColor) solid;
    padding: 6px;
  }

  #mainWindow .loginContainer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #mainWindow .guestLink {
    float: right;
  }

  #mainWindow .explainGuest {
    background-color: var(--darkerColor);
    border-radius: 50%;
    display: inline-block;
    margin-top: 13px;
    width: 1.2rem;
    text-align: center;
  }

  #mainWindow .explainGuest .tooltip {
    opacity: 0;
    /* width: 120px; */
    background-color: var(--darkerColor);
    color: var(--fontColor);
    text-align: left;
    border-radius: 6px;
    padding: 8px;
    pointer-events: none;

    translate: -110% -6px;
    border: 1px var(--fontColor) solid;

    position: absolute;
    z-index: 1;

    transition: opacity ease-in-out 0.2s;
  }

  #mainWindow .explainGuest:hover .tooltip {
    opacity: 1;
  }
</style>