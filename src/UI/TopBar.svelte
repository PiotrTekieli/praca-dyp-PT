<script>
    import { canvasTranslation } from "../lib/stores";
    import IconButton from "./IconButton.svelte";

    export let fileProperties
</script>

<div id="topBar">
    <span id="topBarText">
        {fileProperties.name} ({fileProperties.canvasSize.x} x {fileProperties.canvasSize.y}px) ({Math.round($canvasTranslation.scale * 100 * 100) / 100}%)
    </span>
    <span id="buttons">
        <IconButton icon="help.png" size={16} iconScale={0.8}></IconButton>
        <IconButton icon="dropdown.png" size={16} iconScale={0.8}></IconButton>
    </span>
</div>

<style>
#topBar {
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    width: 100%;
    height: var(--topUIoffset);
    background-color: var(--mainColor);
    z-index: 2;
    box-shadow: 0px var(--lineWidth) 4px var(--lineColor);
    user-select: none;
}

#topBarText {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
}

#buttons {
    margin-left: auto;
    margin-right: 8px;
}

</style>