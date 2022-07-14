<script>
    import { canvasTranslation } from "../lib/stores";


    export let fileProperties
</script>

<div id="topBar">
    {fileProperties.name} ({fileProperties.canvasSize.x} x {fileProperties.canvasSize.y}px) ({Math.round($canvasTranslation.scale * 100 * 100) / 100}%)
</div>

<style>
#topBar {
    position: absolute;
    width: 100%;
    height: var(--topUIoffset);
    background-color: var(--mainColor);
    z-index: 2;
    text-align: center;
    box-shadow: 0px var(--lineWidth) 4px var(--lineColor);
    user-select: none;
}

</style>