<script>
import { onMount } from "svelte";

    import { currentTool, toolSettings } from "../lib/stores";
    import ToolButton from "./ToolButton.svelte";

    export let toolManager
    let widthSlider

    $: currentToolName = currentTool.hasTempTool() ? currentToolName : $currentTool.name
    $: $toolSettings?.width, UpdateSlider()

    function UpdateSlider() {
        if (widthSlider)
            widthSlider.value = $toolSettings?.width
    }

    onMount(() => {
        UpdateSlider()
    })

    let toolList = Object.values(toolManager.getToolList())

    function switchTool(event) {
        toolManager.switchTool(event.detail.name)
    }
</script>

<div id="sidebarContainer">
    <div id="toolsContainer">
        {#each toolList as tool}
            <ToolButton {tool} {currentToolName} on:switch-tool={switchTool}></ToolButton>
        {/each}
    </div>
    <div id="toolOptions">
        Stroke Width:
        <input bind:this={widthSlider} type="range" min="1" max="150" on:input={() => {toolSettings.set({width: widthSlider.value})}}> {widthSlider?.value}
    </div>
</div>

<style>
    div {
        height: 100vh;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        user-select: none;
        color: white;
    }

    #sidebarContainer {
        width: 200px;
        background-color: rgb(89, 87, 91);
        box-shadow: 1px 0px 4px #0005;
        display: flex;
        flex-direction: row;
    }

    #toolsContainer {
        background-color: rgb(65, 63, 68);
        box-shadow: 1px 0px 4px #0005;
        padding: 4px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    #toolOptions {
        width: 100%;
    }


</style>