<script>
    import { onMount } from "svelte"

    import { currentTool, toolSettings } from "../lib/stores"
    import ToolButton from "./ToolButton.svelte"
    import IconButton from "./IconButton.svelte";

    import "reinvented-color-wheel/css/reinvented-color-wheel.min.css"
    import ReinventedColorWheel from "reinvented-color-wheel"

    export let toolManager
    let widthSlider
    let opacitySlider

    let colorWheel

    $: currentToolName = currentTool.hasTempTool() ? currentToolName : $currentTool.displayName
    $: $currentTool.name, UpdateSliders()
    $: $toolSettings.width, UpdateSliders()
    $: $toolSettings.selectedColor, UpdateWheel()

    $: widthSlider, UpdateSliders()
    $: opacitySlider, UpdateSliders()


    function UpdateSliders() {
        if (widthSlider) {
            if (widthSlider.value < 70)
                widthSlider.value = $toolSettings?.width
            else
                widthSlider.value = ($toolSettings?.width + 140) / 3
            addGradient(widthSlider)
        }
        if (opacitySlider) {
            opacitySlider.value = $toolSettings?.opacity * 100
            addGradient(opacitySlider)
        }

    }

    function UpdateWheel() {
        if (colorWheel)
            colorWheel.hex = $toolSettings.colors[$toolSettings.selectedColor]
    }

    onMount(() => {
        colorWheel = new ReinventedColorWheel({
            appendTo: document.getElementById("colorWheel"),

            wheelDiameter: 200-16,
            wheelThickness: 16,
            wheelReflectsSaturation: false,
            hsv: [0, 0, 0],
            onChange: (color) => {
                toolSettings.setColor(color.hex)
            }
        })

        UpdateSliders()
    })

    let toolList = Object.values(toolManager.getToolList())

    function switchTool(event) {
        toolManager.switchTool(event.detail.name)
    }

    function switchColor(index) {
        if ($toolSettings.selectedColor != index)
            toolSettings.switchColor()
    }

    function addGradient(o) {
        if (!o)
            return
        const colorFill = "#aaa"
        const colorRest = "#0006"

        var value = o.value / o.max * 100
        o.style.background = `linear-gradient(to right, ${colorFill} 0%, ${colorFill} ${value}%, ${colorRest} ${value}%, ${colorRest} 100%)`
    }
</script>

<div id="sidebarContainer">
    <div id="toolsContainer">
        {#each toolList as tool}
            {#if !tool?.hidden}
                <ToolButton {tool} {currentToolName} on:switch-tool={switchTool}></ToolButton>
                {#if tool.name == 'eraser' || tool.name == "zoom"}
                <hr>
                {/if}
            {/if}
        {/each}
        <hr>
        <div id="colors" style='--color1: {$toolSettings.colors[0]}; --color2: {$toolSettings.colors[1]}'>
            <div id="color1" class={$toolSettings.selectedColor == 0 ? 'selected' : ''} on:click={() => switchColor(0)}></div>
            <div id="color2" class={$toolSettings.selectedColor == 1 ? 'selected' : ''} on:click={() => switchColor(1)}></div>
        </div>
    </div>
    <div id="toolOptions">
        <div>
            <div>
                {currentToolName}
            </div>
            <hr>
            {#if $toolSettings?.mode != null}
                Mode:
                <div id="modeButtons">

                    {#each $currentTool && currentTool.getSelected()?.modeIcons as icon, index}
                        <IconButton icon={icon} selected={$toolSettings.mode == index} on:click={() => toolSettings.setMode(index)}></IconButton>
                    {/each}

                </div>
            {/if}

            {#if $toolSettings?.width}
                Stroke Width:
                <input bind:this={widthSlider} type="range" min="1" max="100" step="0.1" on:input={() => {addGradient(widthSlider);
                    if (widthSlider.value < 70)
                        toolSettings.setWidth(widthSlider.value)
                    else
                        toolSettings.setWidth(Math.round((widthSlider.value * 3 - 140) * 10) / 10)}}>
                <span class="rangeValue">{$toolSettings.width}</span>
            {/if}

            {#if $toolSettings?.opacity}
                Opacity:
                <input bind:this={opacitySlider} type="range" min="1" max="100" on:input={() => {addGradient(opacitySlider); toolSettings.setOpacity(opacitySlider.value / 100)}}>
                <span class="rangeValue">{$toolSettings.opacity}</span>
            {/if}

        </div>

        <div id="colorWheel">
            <span style={`--color: ${$toolSettings.colors[$toolSettings.selectedColor]}`}>
                <hr>
                <div id="colorDisplay"></div>
                <span>{colorWheel?.rgb[0]}</span>; <span>{colorWheel?.rgb[1]}</span>; <span>{colorWheel?.rgb[2]}</span>
            </span>
        </div>

    </div>
</div>

<style>
    div {
        --gap: 8px;
        --padding: 8px;

        box-sizing: border-box;
        position: relative;
        z-index: 1;
        user-select: none;
        overflow: hidden;
    }

    #sidebarContainer {
        width: calc(200px + 36px);
        top: var(--topUIoffset);
        height: calc(100vh - var(--topUIoffset));
        background-color: var(--mainColor);

        box-shadow: var(--lineWidth) 0px 4px var(--lineColor);
        display: flex;
        flex-direction: row;
    }

    #toolsContainer {
        background-color: var(--mainColor);
        box-shadow: var(--lineWidth) 0px 4px var(--lineColor);
        padding: 4px;
        width: 36px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        flex-shrink: 0;
    }

    #toolsContainer hr {
        margin: 0px 0px;

    }

    #toolOptions {
        width: 100%;
    }

    #modeButtons {
        padding: 4px 8px !important;
    }

    #toolOptions div {
        width: 100%;
        height: auto;
        padding: var(--padding);
    }

    @media (max-height: 480px) {
        #colorWheel {
            display:none !important;
        }
    }

    #colorWheel {
        border-top: var(--lineWidth) var(--lineColor) solid;
        position: absolute;
        display: flex;
        flex-direction: column-reverse;
        bottom: var(--padding);
        gap: 5px;
        text-align: right;
    }

    #colorWheel span span {
        width: 1.7em;
        display:inline-block;
    }

    #colors {
        width: 27px;
        margin: 4px auto;

        overflow: visible;
    }

    #colors #color1, #colors #color2 {
        position: absolute;
        width: 18px;
        height: 18px;
        border: 1px solid black;
    }

    #colors #color1:hover:not(.selected), #colors #color2:hover:not(.selected) {
        border-color: #CCC
    }


    #colors #color1 {
        background-color: var(--color1);
    }

    #colors #color2 {
        left: 9px;
        top: 9px;

        background-color: var(--color2);
    }

    #color1.selected, #color2.selected {
        z-index: 2;
        box-shadow: 0 0 0 1px white;
    }
    #colorDisplay {
        width: 1em !important;
        height: 1em !important;
        margin: 0.2em;
        padding: 0 !important;
        box-sizing: border-box;
        right: calc(4 * 1.7em);
        /*left: 8px;*/
        bottom: var(--padding);
        position: absolute;
        display: inline-block;
        background-color: var(--color);
        border: 1px solid black;
        box-shadow: 0px 0px 0px 1px white;
    }

    hr {
        border-color: var(--lineColor);
        margin: var(--gap) -20px;
    }

</style>