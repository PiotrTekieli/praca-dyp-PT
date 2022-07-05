<script>
    import { currentTool } from "../lib/stores";
import ToolButton from "./ToolButton.svelte";

    export let toolManager

    $: currentToolName = $currentTool.name

    let toolList = Object.values(toolManager.getToolList())

    function switchTool(event) {
        toolManager.switchTool(event.detail.name)
    }
</script>

<div>
    {#each toolList as tool}
        <ToolButton {tool} {currentToolName} on:switch-tool={switchTool}></ToolButton>
    {/each}
</div>

<style>
    div {
        height: 100%;
        padding: 4px;
        box-shadow: 1px 0px 4px #0005;
        background-color: rgb(65, 63, 68);
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 5px;
        z-index: 1;
        user-select: none;
    }

</style>