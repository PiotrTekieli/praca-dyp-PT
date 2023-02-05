<script>
    export let title = ""
    export let icon = ""
    export let selected = false
    export let size = 28
    export let iconScale = 0.642
    export let style = ""
</script>


<div title={title} on:click class={selected ? "selected" : ""} tabindex="-1"
    style="--icon: url(assets/{icon}); --size: {size}px; --iconScale: {iconScale * 100}%; {style}"  aria-hidden="true">
</div>

<style>
    div:before {
        content: "";
        position: absolute;
        /* z-index: -1; */
        flex-shrink: 0;
        width: var(--size);
        height: var(--size);
        background-position: center;
        background-repeat: no-repeat;
        background-size: auto var(--iconScale);
        background-image: var(--icon);
        filter: brightness(75%);
    }

    div {
        display: inline-block;
        height: var(--size);
        width: var(--size);
        padding: auto auto;
        background-color: transparent;
        border: solid 1px transparent;
        flex-shrink: 0;
        flex-grow: 0;
        margin-bottom: -4px;
    }

    div:hover {
        background-color: #FFF2;
    }

    div:focus {
        outline:none
    }

    .selected {
        background-color: #FFF2;
        border-color: black;
    }
</style>