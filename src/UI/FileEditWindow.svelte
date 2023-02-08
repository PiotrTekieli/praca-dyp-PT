<script>
    import { ErrorToast } from "../lib/Toasts";
    import { push } from "svelte-spa-router";
    import Button from "./Button.svelte";
    import Window from "./Window.svelte";

    // export let body = "Are you sure?"
    export let file
    export let DeleteCallback = () => {}
    export let CreateCallback = () => {}
    export let UpdateNameCallback = (name) => {}
    export let DestroyCallback = () => {}

    let fileName = file?.filename ?? "Illustration"
    let newFileWidth = 640
    let newFileHeight = 480
    let _this

    function CheckKey(e) {
        if (e.code == "Escape")
            Cancel()
    }

    function CheckEnter(e) {
        if (e.code == "Enter") {
            if (file)
                Update()
            else
                CreateFile()
        }
    }

    function OpenFile() {
        push(`/edit/${file._id}`)
        Cancel()
    }

    function CreateFile() {
        if (!fileName || !newFileHeight || !newFileWidth)
           return ErrorToast("Missing file name or size")

        // @ts-ignore
        CreateCallback(fileName, newFileWidth, newFileHeight)
        Cancel()
    }

    function Update() {
        if (!fileName)
            return ErrorToast("Missing file name")

        UpdateNameCallback(fileName)
        Cancel()
    }

    function Cancel() {
        DestroyCallback()
        _this.$destroy()
    }
</script>

<svelte:window on:keydown={CheckKey} />

<Window bind:this={_this} title="Open File" on:cancel={Cancel}>
    <div id="windowBody">
        {#if file}
            Preview: <br>
            <div class="thumbnail">
                <img alt="preview" src={file.thumbnail_data ?? "/missing-thumbnail.png"}/>
            </div>
        {/if}

        File name:
        <input class="input-style" bind:value={fileName} on:keypress={CheckEnter}/>

        {#if !file}
            Size: <br>
            <input type="number" bind:value={newFileWidth} class="input-style small" max=2000 min=1 on:keypress={CheckEnter}/> px
            <input type="number" bind:value={newFileHeight} class="input-style small" max=2000 min=1 on:keypress={CheckEnter}/> px
        {:else}
            <Button style="float: right; margin-bottom: 32px;" on:click={Update}>Update</Button><br>
        {/if}
        <div style="clear: both;">
            {#if file}
                <Button style="background-color: #CF3A3A" on:click={DeleteCallback}>Delete</Button>
            {:else}
                <br>
            {/if}

            <div>
                {#if file}
                    <Button primary={true} on:click={OpenFile}>Edit</Button>
                {:else}
                    <Button primary={true} on:click={CreateFile}>Create</Button>
                {/if}
                <Button on:click={Cancel}>Close</Button>
            </div>
        </div>
    </div>
</Window>

<style>
    #windowBody {
        width: 400px;
    }
    #windowBody .thumbnail {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #C4C4C4;
        width: 200px;
        height: 200px;
        margin-bottom: 32px;
        overflow: hidden;
    }

    #windowBody input {
        width: 100%;
        margin-bottom: 16px;
    }

    #windowBody input.small {
        width: 20%;
    }

    #windowBody div {
        display: flex;
        justify-content: space-between;
    }
</style>