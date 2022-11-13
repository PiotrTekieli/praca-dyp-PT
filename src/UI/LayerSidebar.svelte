<script>
    import LayerElement from "./LayerElement.svelte";
    import { layerList } from "../lib/stores"
    import IconButton from "./IconButton.svelte";
    import { onMount } from "svelte";
    import { is_empty } from "svelte/internal";

    export let layerManager

    let opacitySlider

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
        opacitySlider.value = $layerList.list[$layerList.selected].opacity
        opacitySlider.disabled = false
        addGradient(opacitySlider)
    }

    function changeLayerOrder(event) {
        layerManager.putLayerAbove(event.detail.from, event.detail.to)
    }

    function selectLayer(event) {
        layerManager.selectLayer(event.detail.index)
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
            <select>
                <option>Normal</option>
                <option>Some Long one</option>
            </select>
            <input bind:this={opacitySlider} type="range" min="0" max="1" step="0.01" on:input={() => {
                addGradient(opacitySlider)
                layerList.changeOpacity($layerList.selected, opacitySlider.value)
                layerManager.refreshMainCanvas()
            }}>
            <span class="rangeValue">
                {Math.round(($layerList.list?.[$layerList?.selected]?.opacity ?? 1) * 100)}
            </span>
        </div>
        <IconButton title="New Layer" icon="move.png" size={20} iconScale={0.8} on:click={layerManager.newLayer()}></IconButton>
        <IconButton title="Delete Layer" icon="rotate.png" size={20} on:click={layerManager.removeLayer($layerList.selected)}></IconButton>
    </div>
    <div id="layerList">
        {#each $layerList.list as layer, i}
            <LayerElement index={i} {layer} selected={$layerList.selected == i} on:changeOrder={changeLayerOrder} on:select={selectLayer}></LayerElement>
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

    select {
        height: 1.8em;
        font-size: 0.8em;
        width: 7em;
    }

    .rangeValue {
        width: unset;
    }

    input[type=range] {
        width: 60px;
    }

</style>