<script>
    import { canvasTranslation } from "../lib/stores";
    import Button from "./Button.svelte";

    export let fileProperties
</script>

<div id="topBar">
    <span id="topBarText">
        {fileProperties.name} ({fileProperties.canvasSize.x} x {fileProperties.canvasSize.y}px) ({Math.round($canvasTranslation.scale * 100 * 100) / 100}%)
    </span>
    <span id="buttons">
        <Button icon="help.png" size={20}></Button>
        <Button icon="dropdown.png" size={20}></Button>
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
    text-align: center;
    box-shadow: 0px var(--lineWidth) 4px var(--lineColor);
    user-select: none;
}

#topBarText {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

#buttons {
    margin-top: -2px;
    margin-left: auto;
    margin-right: 8px;
}

</style>