<script>
    import { onMount } from "svelte"

    import { currentTool, toolSettings } from "../lib/stores"
    import ToolButton from "./ToolButton.svelte"

    import "reinvented-color-wheel/css/reinvented-color-wheel.min.css"
    import ReinventedColorWheel from "reinvented-color-wheel"

    export let toolManager
    let widthSlider
    let colorWheel

    $: currentToolName = currentTool.hasTempTool() ? currentToolName : $currentTool.name
    $: $toolSettings?.width, UpdateSlider()
    $: $toolSettings.selectedColor, UpdateWheel()

    function UpdateSlider() {
        if (widthSlider)
            widthSlider.value = $toolSettings?.width
    }

    function UpdateWheel() {
        if (colorWheel)
            colorWheel.hex = $toolSettings.colors[$toolSettings.selectedColor]
    }

    onMount(() => {
        colorWheel = new ReinventedColorWheel({
            appendTo: document.getElementById("colorWheel"),

            wheelDiameter: 200-16,
            wheelReflectsSaturation: false,
            hsv: [0, 0, 0],
            onChange: (color) => {
                toolSettings.setColor(color.hex)
            }
        })


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

        <div id="colorWheel">
            <span style={`--color: ${$toolSettings.colors[$toolSettings.selectedColor]}`}>
                <div id="colorDisplay"></div>
                {colorWheel?.rgb}
            </span>
        </div>
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
        width: calc(200px + 36px);
        background-color: rgb(65, 63, 68);

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

    #colorWheel {
        height: auto;
        position: absolute;
        bottom: 8px;
        display: flex;
        flex-direction: column-reverse;
        gap: 5px;
        text-align: right;
    }

    #colorDisplay {
        width: 12px;
        height: 12px;
        left: 4px;
        bottom: 4px;
        position: absolute;
        display: inline-block;
        background-color: var(--color);
        border: 1px solid black;
    }

    #colorWheel span {
        border-top: 1px solid black;
    }


</style>