<button on:click>
    <slot></slot>
</button>

<style>
    button {
        color: rgb(234, 235, 236);
        border: 1px solid black;
        background-color: transparent;
        padding: 4px 8px;
        min-width: 60px;
        margin: 4px;
    }

    button:hover {
        background-color: #FFF2;
    }

    button:focus {
        outline:none
    }

</style>