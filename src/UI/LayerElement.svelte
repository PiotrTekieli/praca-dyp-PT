<script>
    import { createEventDispatcher } from 'svelte';
    import { element } from 'svelte/internal';

    export let layer
    export let selected
    export let index

    const dispatch = createEventDispatcher();

    let _this
    const highlightBorder = "2px solid red"

    function PickUp(e) {
        let mousePosition = {
            x: e.pageX,
            y: e.pageY
        }
        let size = _this.getBoundingClientRect()

        let drag
        let hoveredOver
        let parent = e.target.parentElement

        parent.classList.add("select")
        window.addEventListener("pointermove", CreateDrag, true)
        window.addEventListener("pointerup", EndDrag, {once: true})

        dispatch("select", {
            index: parseInt(e.target.id)
        })

        function CreateDrag(e) {
            if (Math.abs(mousePosition.x - e.pageX) > 20 || Math.abs(mousePosition.y - e.pageY) > 20) {
                drag = _this.cloneNode(true)

                drag.classList.remove("selected")
                drag.classList.add("drag")

                _this.parentElement.appendChild(drag)
                window.removeEventListener("pointermove", CreateDrag, true)
                window.addEventListener("pointermove", UpdateDragPosition, true)
            }
        }


        function UpdateDragPosition(e) {
            drag.style.left = (e.pageX - size.width / 2).toString() + "px"
            drag.style.top = (e.pageY - size.height / 2).toString() + "px"

            let elementFound = document.elementFromPoint(e.pageX, e.pageY + size.height / 2)

            if (elementFound) {
                if (hoveredOver && elementFound != hoveredOver)
                    setBorder(hoveredOver, "")

                if (elementFound == _this.parentElement.parentElement || elementFound.parentElement == _this.parentElement) {
                    hoveredOver = elementFound
                    setBorder(hoveredOver, highlightBorder)
                }
            }
        }

        function EndDrag(e) {
            parent.classList.remove("select")
            drag?.remove();
            window.removeEventListener("pointermove", CreateDrag, true)
            window.removeEventListener("pointermove", UpdateDragPosition, true)

            let destination = null

            if (hoveredOver) {
                if (hoveredOver.querySelector("#layerList"))
                    destination = -1
                else
                    destination = parseInt(hoveredOver.id)

                if (destination != null) {
                    setBorder(hoveredOver, "")

                    dispatch("changeOrder", {
                        from: index,
                        to: destination
                    })
                }
            }
        }
    }

    function setBorder(hoveredOver, border) {
        if (hoveredOver.querySelector("#layerList"))
            hoveredOver.querySelector("#layerList").firstChild.style.borderBottom = border
        else
            hoveredOver.style.borderTop = border
        hoveredOver.style.zIndex = border != "" ? "1" : ""
    }


</script>

<div id={index} class:selected class:drag={0} bind:this={_this} on:pointerdown={PickUp}>
    {Math.round(layer.opacity * 100)}% Opacity
    <br>
    {layer.name}
</div>

<style>
    div {
        flex: 0 0 1;
        flex-shrink: 0;
        height: 3em;
        line-height: 150%;
        padding: 8px;
        margin-bottom: -2px;
        border-bottom: var(--lineWidth) var(--lineColor) solid;
        border-top: var(--lineWidth) var(--lineColor) solid;
        background-color: var(--mainColor);
        box-sizing: content-box;
    }


    .selected {
        background-color: #FFF2;
    }

    .drag {
        width: 200px;
        opacity: 0.6;
        position: fixed;
        pointer-events: none;
        z-index: 10;
    }
</style>