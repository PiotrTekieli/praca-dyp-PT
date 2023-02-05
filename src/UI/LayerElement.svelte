<script>
    import { layerList } from '../lib/stores';
    import { createEventDispatcher } from 'svelte';

    export let layer
    export let selected
    export let index

    const dispatch = createEventDispatcher();

    let _this
    let main = document.getElementsByTagName("main")[0]
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
        main.addEventListener("pointermove", CreateDrag, true)
        main.addEventListener("pointerup", EndDrag, {once: true})

        dispatch("select", {
            index: parseInt(_this.id)
        })

        function CreateDrag(e) {
            if (Math.abs(mousePosition.x - e.pageX) > 20 || Math.abs(mousePosition.y - e.pageY) > 20) {
                drag = _this.cloneNode(true)

                drag.classList.remove("selected")
                drag.classList.add("drag")

                _this.parentElement.appendChild(drag)
                main.removeEventListener("pointermove", CreateDrag, true)
                main.addEventListener("pointermove", UpdateDragPosition, true)
            }
        }


        function UpdateDragPosition(e) {
            drag.style.left = (e.pageX - size.width / 2).toString() + "px"
            drag.style.top = (e.pageY - size.height / 2).toString() + "px"

            let elementFound = document.elementFromPoint(e.pageX, e.pageY + size.height / 2)

            if (elementFound) {
                if (hoveredOver && elementFound != hoveredOver)
                    setBorder(hoveredOver, "")

                if (elementFound == _this.parentElement.parentElement || elementFound.parentElement.parentElement == _this.parentElement || elementFound.parentElement == _this.parentElement) {
                    if (elementFound.parentElement.parentElement == _this.parentElement)
                        hoveredOver = elementFound.parentElement
                    else
                        hoveredOver = elementFound
                    setBorder(hoveredOver, highlightBorder)
                }
            }
        }

        function EndDrag(e) {
            parent.classList.remove("select")
            drag?.remove();
            main.removeEventListener("pointermove", CreateDrag, true)
            main.removeEventListener("pointermove", UpdateDragPosition, true)

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

<div id={index} class="mainDiv" class:selected class:drag={0} bind:this={_this} on:pointerdown={PickUp}>
    <div class="flexDiv">
        <div class="viewIcon" class:iconVisible={layer.visible} on:click=
        {() => dispatch("toggleVisibility", {
            index: parseInt(_this.id)
        })} aria-hidden="true"/>
        <div>
            {Math.round(layer.opacity * 100)}% Opacity
            {#if layer.lock}
                <img class="lockIcon" alt="lock" width="12" src="/lock.png"/>
            {/if}
            <br>
            {layer.name}
        </div>
    </div>
    <span id="mouse-detect"/>
</div>

<style>
    .mainDiv {
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
        overflow: hidden;
    }

    .flexDiv {
        display: flex;
        gap: 8px;
    }

    .viewIcon {
        filter: brightness(75%);
        margin: auto 0;
        width: 16px;
        height: 16px;
        background-image: url("/eye-crossed.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .viewIcon.iconVisible {
        background-image: url("/eye.png");
    }

    .lockIcon {
        filter: brightness(75%);
        position: absolute;
        right: 12px;
        translate: 0px 4px;
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

    #mouse-detect {
        background-color: transparent;
        display: block;
        width: 93%;
        height: 147%;
        position: relative;
        left: 11%;
        top: -125%;
    }
</style>