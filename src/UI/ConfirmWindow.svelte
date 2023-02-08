<script>
    import Button from "./Button.svelte";
    import Window from "./Window.svelte";

    export let body = "Are you sure?"
    export let AcceptCallback = () => {}
    export let DeclineCallback = () => {}
    export let DestroyCallback = () => {}

    let _this

    function CheckKey(e) {
        if (e.code == "Enter")
            Accept()
        if (e.code == "Escape")
            Cancel()
    }

    function Accept() {
        AcceptCallback()
        DestroyCallback()
        _this.$destroy()
    }

    function Cancel() {
        DeclineCallback()
        DestroyCallback()
        _this.$destroy()
    }
</script>

<svelte:window on:keydown={CheckKey} />

<Window bind:this={_this} title="Confirm" on:cancel={Cancel}>
    {body}
    <div>
        <Button primary={true} on:click={Accept}>Yes</Button>
        <Button on:click={Cancel}>Cancel</Button>
    </div>
</Window>

<style>
    div {
        margin: 4px;
        display: flex;
        justify-content: flex-end;
    }
</style>