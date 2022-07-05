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
        height: 30px;
        width: 30px;
        padding: auto auto;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 70%;
        background-color: transparent;
        border: none;
        border-radius: 5px;
        box-shadow: 1px 2px 3px #0006;

    }

    button:hover {
        background-color: #FFF2;
    }

    button:focus {
        outline:none
    }

    .selected {
        box-shadow: inset 3px 3px 3px #000C;
    }
</style>