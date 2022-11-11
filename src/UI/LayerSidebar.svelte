<script>
    import LayerElement from "./LayerElement.svelte";
    import { layerList } from "../lib/stores"

    export let layerManager

    function changeLayerOrder(event) {
        layerManager.putLayerAbove(event.detail.from, event.detail.to)
    }

    function selectLayer(event) {
        layerManager.selectLayer(event.detail.index)
    }

</script>

<div id="sidebarContainer">
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

    #layerList {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-end;

    }

</style>