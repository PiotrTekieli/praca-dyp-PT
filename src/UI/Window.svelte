<script>
    import { createEventDispatcher } from 'svelte';
    export let title = "Window"

    const dispatch = createEventDispatcher();

    let window
</script>

<div id="windowBackground" bind:this={window} on:click|stopPropagation={() => { dispatch('cancel'); window.parentElement?.querySelector(window)?.remove() }} aria-hidden="true">
    <div id="window" on:click|stopPropagation aria-hidden="true">
        <div id="windowHeader">{title}</div>
        <div>
            <slot></slot>
        </div>
    </div>
</div>

<style>
    #windowBackground {
        background-color: #0006;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 5;
    }

    #window {
        background-color: var(--mainColor);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 6;
        box-shadow: 0px 0px 4px var(--mainColor);
        border-radius: 4px;
        min-height: 100px;
        min-width: 300px;
    }

    #window > div {
        padding: 8px;
    }

    #windowHeader {
        background-color: #FFF2;
    }
</style>