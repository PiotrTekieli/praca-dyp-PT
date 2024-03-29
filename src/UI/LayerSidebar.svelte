<script>
    import LayerElement from "./LayerElement.svelte";
    import { layerList } from "../lib/stores"
    import IconButton from "./IconButton.svelte";
    import { onMount } from "svelte";
    import History from "../Canvas/History";

    export let layerManager

    let opacitySlider
    let previousOpacityValue = null

    $: $layerList.selected, updateOpacitySlider()

    function updateOpacitySlider() {
        if (!opacitySlider)
            return

        if (layerList.isEmpty()) {
            opacitySlider.value = 1
            opacitySlider.disabled = true
            addGradient(opacitySlider)
            return
        }

        if (!opacitySlider.disabled && opacitySlider.value == (layerList.getSelected()?.opacity ?? -1))
            return

        previousOpacityValue = null
        opacitySlider.value = layerList.getSelected().opacity
        opacitySlider.disabled = false
        addGradient(opacitySlider)
    }

    function changeLayerOrder(event) {
        layerManager.putLayerAbove(event.detail.from, event.detail.to)
    }

    function selectLayer(event) {
        layerManager.selectLayer(event.detail.index)
    }

    function toggleVisibility(event) {
        layerManager.toggleLayerVisibility(event.detail.index)
    }

    function addGradient(o) {
        if (!o)
            return
        const colorFill = "#aaa"
        const colorRest = "#0006"

        var value = o.value / o.max * 100
        o.style.background = `linear-gradient(to right, ${colorFill} 0%, ${colorFill} ${value}%, ${colorRest} ${value}%, ${colorRest} 100%)`
    }

    onMount(() => {
        addGradient(opacitySlider)
    })

</script>

<div id="sidebarContainer">
    <div id="layerControls">
        <div id="sliderContainer">
            <input bind:this={opacitySlider} type="range" min="0" max="1" step="0.01" on:input={() => {
                if (!previousOpacityValue)
                    previousOpacityValue = layerList.getSelected().opacity
                addGradient(opacitySlider)
                layerList.changeOpacity($layerList.selected, opacitySlider.value)
                layerManager.refreshMainCanvas()
            }} on:change={() => {
                History.addStep({ type: 'change-opacity', index: $layerList.selected, from: previousOpacityValue, to: opacitySlider.value })
                previousOpacityValue = null
            }}>
            <span class="rangeValue">
                {Math.round(($layerList.list?.[$layerList.selected]?.opacity ?? 1) * 100)}
            </span>
        </div>
        <IconButton title="New Layer" icon="new-layer.png" size={20} on:click={layerManager.newLayer()}></IconButton>
        <IconButton title="Delete Layer" icon="delete.png" size={20} on:click={layerManager.removeLayer($layerList.selected)}></IconButton>
        <IconButton title="Lock/Unlock Layer" icon="lock.png" size={20} on:click={layerManager.toggleLayerLock($layerList.selected)} selected={$layerList.list[$layerList.selected]?.lock}></IconButton>
    </div>
    <div id="layerList">
        {#each $layerList.list as layer, i}
            <LayerElement index={i} {layer} selected={$layerList.selected == i} on:changeOrder={changeLayerOrder} on:select={selectLayer} on:toggleVisibility={toggleVisibility}></LayerElement>
        {/each}
    </div>
</div>

<style>
    #sidebarContainer {
        box-sizing: border-box;
        position: absolute;
        z-index: 1;
        user-select: none;
        overflow: auto;
        width: 200px;
        top: var(--topUIoffset);
        height: calc(100vh - var(--topUIoffset));
        background-color: var(--mainColor);
        box-shadow: calc(var(--lineWidth) * -1) 0px 4px var(--lineColor);
        right: 0;
        padding-bottom: 20px;
    }

    #layerControls {
        padding: 8px;
    }

    #sliderContainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #layerList {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-end;
    }

    .rangeValue {
        width: 2em;
    }

    input[type=range] {
        width: 140px;
    }

</style>