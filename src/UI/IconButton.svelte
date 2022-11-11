<script>
    export let icon = ""
    export let selected = false
    export let size = 28

</script>


<button on:click class={selected ? "selected" : ""} tabindex="-1"
    style="--icon: url({icon}); --size: {size}px">
</button>

<style>
    button:before {
        content: "";
        position: absolute;
        transform: translate(-50%, -50%);
        z-index: -1;
        flex-shrink: 0;
        width: var(--size);
        height: var(--size);
        background-position: center;
        background-repeat: no-repeat;
        background-size: auto 64.2%;
        background-image: var(--icon);
        filter: brightness(75%);
    }

    button {
        height: var(--size);
        width: var(--size);
        padding: auto auto;
        background-color: transparent;
        border: solid 1px transparent;
        flex-shrink: 0;
        flex-grow: 0;
    }

    button:hover {
        background-color: #FFF2;
    }

    button:focus {
        outline:none
    }

    .selected {
        background-color: #FFF2;
        border-color: black;
    }
</style>