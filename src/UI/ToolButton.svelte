<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';


    const dispatch = createEventDispatcher();

    export let currentToolName
    export let tool

    function switchTool(toolName) {
        dispatch('switch-tool', {
            name: toolName
        })
    }
</script>


<Button on:click={() => switchTool(tool.name)} selected={currentToolName == tool.displayName} icon={tool?.icon}></Button>
