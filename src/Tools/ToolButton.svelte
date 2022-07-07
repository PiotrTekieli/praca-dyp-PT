<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let currentToolName
    export let tool

    function switchTool(toolName) {
        dispatch('switch-tool', {
            name: toolName
        })
    }
</script>


<button on:click={() => switchTool(tool.name)} class={currentToolName == tool.name ? "selected" : ""} tabindex="-1"
    style="background-image: url({tool?.icon})">
</button>

<style>
    button {
        height: 28px;
        width: 28px;
        padding: auto auto;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 70%;
        background-color: transparent;
        border: none;
        border-radius: 1px;

    }

    button:hover {
        background-color: #FFF2;
    }

    button:focus {
        outline:none
    }

    .selected {
        background-color: #FFF2;
        border: solid 1px black;
    }
</style>