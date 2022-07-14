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


<button on:click={() => switchTool(tool.name)} class={currentToolName == tool.displayName ? "selected" : ""} tabindex="-1"
    style="--icon: url({tool?.icon})">
</button>

<style>
    button:before {
        content: "";
        position: fixed;
        transform: translate(-50%, -50%);
        z-index: -1;
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 18px;
        background-image: var(--icon);
        filter: brightness(75%);
    }

    button {
        height: 28px;
        width: 28px;
        padding: auto auto;
        background-color: transparent;
        border: solid 1px transparent;
        flex-shrink: 0;
    }

    button:hover {
        background-color: #FFF2;
    }

    button:focus {
        outline:none
    }

    .selected {
        background-color: #FFF2;
        border-color: black;
    }
</style>