<script>
  import axios from 'axios';
  import { push } from 'svelte-spa-router'
  import { onMount } from 'svelte';
  import { checkToken } from './lib/checkToken';
  import { ErrorToast, InfoToast, SuccessToast } from './lib/Toasts';
  import ConfirmWindow from './UI/ConfirmWindow.svelte';
    import FileEditWindow from './UI/FileEditWindow.svelte';

  let config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  }

  let page = 0
  let pageTotal
  let files = []

  let user

  onMount(async () => {
    user = await checkToken()
    if (!user)
      push("/")

    await RefreshFileList(page)
    console.log(files)
  })

  async function RefreshFileList(_page) {
    page = _page
    let response = (await axios.get(import.meta.env.VITE_HOSTURL + "/file/" + _page, config).catch(err => {
      ErrorToast()
    }))
    if (response && response.status == 200) {
      files = response.data.files
      pageTotal = Math.ceil(response.data.count / 8)
    }
  }

  async function Logout() {
    let response = (await axios.post(import.meta.env.VITE_HOSTURL + "/auth/logout", {}, config).catch(err => {}))
    InfoToast("Logged out")
    localStorage.removeItem("token")
    push("/")
  }

  async function CreateNewFile(name, width, height) {
    let response = (await axios.post(import.meta.env.VITE_HOSTURL + "/file/create-new", { filename: name, width: width, height: height }, config).catch(err => {
      if (err.response)
        ErrorToast(err.response.data.message)
      else
        ErrorToast()
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
          let response = (await axios.post(import.meta.env.VITE_HOSTURL + "/file/delete", { file_id: id }, config).catch(err => {
            ErrorToast("Something went wrong while deleting")
          }))
          if (response && response.status == 200) {
            await RefreshFileList()
            InfoToast("File deleted")
          }
        },
        DestroyCallback: async () => {
          confirmWindow.$destroy()
        }
      }
    })
  }

  let window

  function CreateFileEditWindow(file) {
    if (window)
      return
    window = new FileEditWindow({
      target: document.body,
      props: {
        file: file,
        DeleteCallback: () => {
          DeleteFile(file._id, file.filename)
          window.$destroy()
          window = null
        },
        CreateCallback: CreateNewFile,
        UpdateNameCallback: async (name) => {
          let response = (await axios.post(import.meta.env.VITE_HOSTURL + "/file/rename", { file_id: file._id, filename: name }, config).catch(err => {
            ErrorToast()
          }))
          if (response && response.status == 200) {
            await RefreshFileList()
            InfoToast("File renamed")
          }
        },
        DestroyCallback: () => {
          window.$destroy()
          window = null
        },
      }
    })
  }
</script>

<div id="topbar">
  <!-- header here -->
  <div>
    File Page
  </div>
  <div>
    <span id="accountName">{user?.username ?? ""}</span>
    <button on:click={Logout} class="primary-button">Logout</button>
  </div>
</div>

<div id="container">
  <div id="fileContainer">
    {#each files as file}
      <button class="fileTile" on:click={() => CreateFileEditWindow(file)}>
        <div style="overflow:hidden">
          <img alt="thumbnail" src={file.thumbnail_data ?? "/missing-thumbnail.png"}/>
        </div>
        <span class="nameDisplay">
          {file.filename}
        </span>
      </button>
    {/each}
    <div id="pageButtons">
      {#if page > 0}
        <button class="primary-button" on:click={() => RefreshFileList(page-1)}>Previous Page</button>
      {/if}
      {#if pageTotal > page + 1}
        <button class="primary-button" on:click={() => RefreshFileList(page+1)}>Next Page</button>
      {/if}
    </div>
    <div style="width: 100%; padding: 4px; padding-top: 16px">
      <button on:click={() => CreateFileEditWindow()} class="primary-button" style="float:right">Create New</button>
    </div>
  </div>
</div>

<style>
  #topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    box-shadow: 0px var(--lineWidth) 4px var(--lineColor);
    padding: 4px 16px;
    box-sizing: border-box;
  }

  #pageButtons {
    margin: 4px;
    width: 100%;
    display: flex;
    gap: 16px;
    justify-content: center;
  }

  #accountName {
    margin-right: 16px;
  }

  #container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-top: 100px;

    --tileWidth: 200px;
    --tileHeight: 240px;
  }

  #fileContainer {
    display: flex;
    margin: auto auto;
    /* width: fit-content; */
    width: calc(var(--tileWidth) * 4 + 32px);
    flex-wrap: wrap;
  }

  .fileTile {
    background-color: #686868;
    margin: 4px;
    width: var(--tileWidth);
    height: var(--tileHeight);
    border: none;
    padding: 0;
    color: var(--fontColor);
    text-align: left;
    overflow: hidden;
  }

  .fileTile:hover {
    cursor: pointer;
  }

  .fileTile:hover::before {
    content: "";
    position: absolute;
    background-color: var(--mainBlueColor);
    height: calc(var(--tileHeight) + 8px);
    width: calc(var(--tileWidth) + 8px);
    translate: -4px -4px;
    z-index: -1;
    display: block;
    pointer-events: none;
  }

  .fileTile .nameDisplay {
    padding: 12px;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .fileTile div {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #c4c4c4;
  }

  #sidebar {
    width: 300px;
    box-shadow: calc(var(--lineWidth) * -1) 0px 4px var(--lineColor);
    position: fixed;
    right: 0;
    height: 100%;
  }
</style>
