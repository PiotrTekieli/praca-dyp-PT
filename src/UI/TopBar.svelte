<script>
    import { canvasTranslation } from "../lib/stores";
    import IconButton from "./IconButton.svelte";

    export let fileProperties

    let dropdown
    function openDropdown() {
        if (dropdown)
            dropdown.style.display = "block"
    }

    function closeDropdown() {
        if (dropdown)
            dropdown.style.display = "none"
    }
</script>

<div id="topBar">
    <span id="topBarText">
        {fileProperties.name} ({fileProperties.canvasSize.x} x {fileProperties.canvasSize.y}px) ({Math.round($canvasTranslation.scale * 100 * 100) / 100}%)
    </span>
    <span id="buttons">
        <IconButton icon="help.png" size={16} iconScale={0.8}></IconButton>
        <IconButton icon="dropdown.png" size={16} iconScale={0.8} on:click={openDropdown}></IconButton>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div id="dropdown" bind:this={dropdown} on:pointerleave={closeDropdown} on:click={closeDropdown}>
            <slot name="dropdown"></slot>
        </div>
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

#dropdown {
    display:none;
    position: absolute;
    z-index: 10;
    right: 0;
    top: -22px;
    width: 180px;
    margin-top: 22px;
    padding-top: 22px;
}
:global(#dropdown button) {
    border: none;
    padding: 8px;
    width: 100%;
    text-align: left;
    background-color: white;
}

:global(#dropdown button:disabled:hover, button[disabled]:hover) {
    background-color: rgb(197, 196, 196);
}

:global(#dropdown button:hover) {
    background-color: #3B6BA4;
}

</style>