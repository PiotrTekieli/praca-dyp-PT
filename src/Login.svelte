<script>
  import axios from 'axios';
  import { link, push } from 'svelte-spa-router'
  import { onMount } from 'svelte';
  import { checkToken } from './lib/checkToken';
  import { ErrorToast, InfoToast, SuccessToast } from './lib/Toasts';

  let viewId = 0

  let username
  let password
  let loginButton

  let registerUsername
  let registerPassword
  let email
  let registerButton

  let forgotPasswordUsername
  let forgotPasswordButton

  onMount(async () => {
    if ((await checkToken()))
      push("/files")
  })

  async function AttemptLogin() {
    let loginResponse = (await axios.post(import.meta.env.VITE_HOSTURL + "/auth/login", { username: username, password: password }).catch(err => {
      if (err.response)
        ErrorToast(err.response.data.message)
      else
        ErrorToast()
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
      if (err.response)
        ErrorToast(err.response.data.message)
      else
        ErrorToast()
    }))

    console.log(signupResponse)
    if (signupResponse && signupResponse.status == 201)
      SuccessToast("Account creation successful! Please confirm your email")
  }

  async function AttemptPasswordReset() {
    if (!forgotPasswordUsername)
      return ErrorToast("Please input a username")

    let signupResponse = (await axios.post(import.meta.env.VITE_HOSTURL + "/auth/forgot-password", { username: forgotPasswordUsername }).catch(err => {}))
    InfoToast("If the username exists, the email to reset password has been sent")
  }

  function checkEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      if (viewId == 0)
        loginButton.click()
      else if (viewId == 1)
        registerButton.click()
      else if (viewId == 2)
        forgotPasswordButton.click()
    }
  }

</script>

<div id="background"></div>

<div id="mainWindow">
  {#if viewId == 0}
    <div class="header">Login</div>

    <div class="label">Username</div>
    <input class="input-style" bind:value={username} on:keypress={checkEnter}/>
    <div class="label">Password</div>
    <input class="input-style" type="password" bind:value={password} on:keypress={checkEnter}/>

    <a href="/#" on:click={() => viewId = 2}>Forgot Password</a>

    <div class="loginContainer" style="margin-top: 12px;">
      <a href="/#" on:click={() => viewId = 1}>Create an Account</a>

      <button bind:this={loginButton} on:click={AttemptLogin} class="primary-button">Login</button>
    </div>
  {:else if viewId == 1}
    <div class="header">Register Account</div>

    <div class="label">Username</div>
    <input class="input-style" bind:value={registerUsername} on:keypress={checkEnter}/>

    <div class="label">Password</div>
    <input class="input-style" type="password" bind:value={registerPassword} on:keypress={checkEnter}/>

    <div class="label">Email</div>
    <input class="input-style" bind:value={email} on:keypress={checkEnter}/>

    <div class="loginContainer">
      <a href="/#" on:click={() => viewId = 0}>Back to Login</a>

      <button bind:this={registerButton} on:click={AttemptSignup} class="primary-button">Register</button>
    </div>
  {:else if viewId == 2}
    <div class="header">Forgot Password</div>

    <div class="label">Username</div>
    <input class="input-style" bind:value={forgotPasswordUsername} on:keypress={checkEnter}/>
    <div class="loginContainer">
      <a href="/#" on:click={() => viewId = 0}>Back to Login</a>

      <button bind:this={forgotPasswordButton} on:click={AttemptPasswordReset} class="primary-button">Submit</button>
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