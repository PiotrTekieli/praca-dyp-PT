<script>
  import axios from 'axios';
  import {link, push} from 'svelte-spa-router'
  import { onMount } from 'svelte';
  import { checkToken } from './lib/checkToken';
  import { ErrorToast, InfoToast, SuccessToast } from './lib/Toasts';
  import ConfirmWindow from './UI/ConfirmWindow.svelte';

  let config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  }

  let page = 0
  let files = []

  let newFileName
  let newFileWidth
  let newFileHeight

  onMount(async () => {
    if (!(await checkToken()))
      push("/")

    await RefreshFileList()
    console.log(files)
  })

  async function RefreshFileList() {
    files = (await axios.get(import.meta.env.VITE_HOSTURL + "/file/0", config).catch(err => {})).data
  }

  async function Logout() {
    let response = (await axios.post(import.meta.env.VITE_HOSTURL + "/auth/logout", {}, config).catch(err => {}))
    localStorage.removeItem("token")
    push("/")
  }

  async function CreateNewFile() {
    if (!newFileName || !newFileHeight || !newFileWidth)
      return ErrorToast("Missing file name or size")

    let response = (await axios.post(import.meta.env.VITE_HOSTURL + "/file/create-new", { filename: newFileName, width: newFileWidth, height: newFileHeight }, config).catch(err => {
      ErrorToast(err.response.data.message)
    }))
    console.log(response)
    if (response && response.status == 201) {
      SuccessToast("File created successfully!")
      push(`/edit/${response.data._id}`)
    }
  }

  async function DeleteFile(id, filename) {
    let confirmWindow = new ConfirmWindow({
      target: document.body,
      props: {
        body: "Are you sure you want to delete \"" + filename + "\"",
        AcceptCallback: async () => {
          let response = (await axios.post(import.meta.env.VITE_HOSTURL + "/file/delete", { file_id: id }, config).catch(err => {}))
          await RefreshFileList()
          InfoToast("File deleted")
        },
        DestroyCallback: async () => {
          confirmWindow.$destroy()
        }
      }
    })
  }
</script>

File Page
<br>
{#each files as file}
  Name: {file.filename}
  <br>
  File id: {file._id}
  <br>
  <img alt="thumbnail" src={file.thumbnail_data}/>
  <a href="/edit/{file._id}" use:link>Edit</a>
  <button on:click={() => DeleteFile(file._id, file.filename)}>Delete</button>
  <br><br>
{/each}

<input bind:value={newFileName}/>
<input type="number" bind:value={newFileWidth} min="1" max="1000"/>
<input type="number" bind:value={newFileHeight} min="1" max="1000"/>
<button on:click={CreateNewFile}>Create New</button>

<button on:click={Logout}>Logout</button>