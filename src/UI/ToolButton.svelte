<script>
    import { createEventDispatcher } from 'svelte';
    import IconButton from './IconButton.svelte';


    const dispatch = createEventDispatcher();

    export let currentToolName
    export let tool

    function switchTool(toolName) {
        dispatch('switch-tool', {
            name: toolName
        })
    }
</script>


<IconButton on:click={() => switchTool(tool.name)} selected={currentToolName == tool.displayName} icon={tool?.icon}></IconButton>
