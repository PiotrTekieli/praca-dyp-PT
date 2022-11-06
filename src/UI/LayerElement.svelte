<script>
    import { createEventDispatcher } from 'svelte';

    export let layer
    export let selected
    export let index

    const dispatch = createEventDispatcher();

    let _this

    function PickUp() {
        let drag = _this.cloneNode(true)
        let hoveredOver

        drag.classList.remove("selected")
        drag.classList.add("drag")

        _this.parentElement.appendChild(drag)

        window.addEventListener("pointermove", UpdateGrabPosition, true)

        function UpdateGrabPosition(e) {
            drag.style.left = (e.pageX - 100).toString() + "px"
            drag.style.top = (e.pageY - 25).toString() + "px"

            let elementFound = document.elementFromPoint(e.pageX, e.pageY)

            if (hoveredOver) {
                if (hoveredOver == _this.parentElement.parentElement) {
                    hoveredOver.firstChild.style.borderBottom = "1px solid red"

                    if (elementFound != hoveredOver)
                        hoveredOver.firstChild.style.borderBottom = ""
                }
                if (hoveredOver.parentElement == _this.parentElement) {
                    hoveredOver.style.borderTop = "1px solid red"

                    if (elementFound != hoveredOver)
                        hoveredOver.style.borderTop = ""
                }
            }

            if (elementFound == _this.parentElement.parentElement || elementFound.parentElement == _this.parentElement)
                hoveredOver = document.elementFromPoint(e.pageX, e.pageY)
        }

        window.addEventListener("pointerup", (e) => {
            drag.remove();
            window.removeEventListener("pointermove", UpdateGrabPosition, true)

            let elementFound = document.elementFromPoint(e.pageX, e.pageY)
            let destination = null

            if (elementFound == _this.parentElement.parentElement) {
                destination = -1
                if (hoveredOver) {
                    hoveredOver.firstChild.style.borderBottom = ""
                }
            }

            if (elementFound.parentElement == _this.parentElement) {
                destination = parseInt(elementFound.id)
                if (hoveredOver) {
                    hoveredOver.style.borderTop = ""
                }
            }

            if (destination != null) {
                dispatch("changeOrder", {
                    from: index,
                    to: destination
                })
            }

        }, {once: true})
    }

</script>

<div id={index} class:selected class:drag={0} bind:this={_this} on:pointerdown={PickUp}>
    {layer.name}
</div>

<style>
    div {
        flex: 0 0 1;
        flex-shrink: 0;
        height: 50px;
        padding: 8px;
        border-bottom: var(--lineWidth) var(--lineColor) solid;
        background-color: var(--mainColor);
        box-sizing: border-box;
    }


    .selected {
        background-color: #FFF2;
    }

    .drag {
        width: 200px;
        opacity: 0.6;
        position: fixed;
        pointer-events: none;
    }
</style>