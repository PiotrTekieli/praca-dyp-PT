<script>
    import Button from "./Button.svelte";
    import Window from "./Window.svelte";
    import { layerList }from "../lib/stores"
    import { onMount } from "svelte";
    import History from "../Canvas/History"

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let DestoryCallback

    let _this
    let input
    let _newName = $layerList.list[$layerList.selected].name
    let _oldName = _newName

    window.addEventListener("keydown", CheckKey, true)

    onMount(() => {
        input.select()
    })

    function CheckKey(e) {
        if (e.code == "Enter")
            Accept()
        if (e.code == "Escape")
            Cancel()
    }

    function Accept() {
        History.addStep({ type: "rename-layer", index: $layerList.selected, oldName: _oldName, newName: _newName})
        layerList.renameLayer($layerList.selected, _newName ?? "")
        Cancel()
    }

    function Cancel() {
        window.removeEventListener("keydown", CheckKey, true)
        dispatch('finish')
        DestoryCallback()
        _this.$destroy()
    }
</script>

<Window bind:this={_this} title="Rename layer" on:cancel={Cancel}>
    <input bind:this={input} bind:value={_newName} type="text"><br>
    <div>
        <Button on:click={Accept}>OK</Button>
        <Button on:click={Cancel}>Cancel</Button>
    </div>
</Window>

<style>
    input {
        background-color: #FFF2;
        color: white;
        margin: 8px 0;
        border: black 1px solid;
        width: 300px;
    }

    div {
        display: flex;
        justify-content: flex-end;
    }
</style>