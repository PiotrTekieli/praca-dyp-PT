<script>
    export let fileProperties
</script>

<div id="topBar">
    {fileProperties.name} ({fileProperties.canvasSize.x}x{fileProperties.canvasSize.y})
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