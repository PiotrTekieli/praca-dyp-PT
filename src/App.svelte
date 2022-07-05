<script>
  import { onMount } from "svelte";

  import LayerManager from './Canvas/LayerManager'
  import ToolManager from "./Tools/ToolManager"
  import History from "./Canvas/History";

  import { canvasTranslation, currentContext, currentTool, modifierKeys } from "./lib/stores"

  import Pointer from './Canvas/Pointer'
import ToolSidebar from "./Tools/ToolSidebar.svelte";

  let canvasSize = {
    x: 600,
    y: 500
  }

  let canvasContainer
  let baseCanvas

  let layerManager
  let editingCtx

  let pointer
  let toolManager = new ToolManager()
  let tool

  let drawing = false
  let pressedKey = ''

  let cursorCss

  $: drawing, console.log("Drawing: ", drawing)
  $: {
    tool = $currentTool
    cursorChange()
  }

  function cursorChange() {
    cursorCss = `--cursor: ${tool?.cursor ?? 'auto'}`
  }

  const modifierKeyNames = ["Alt", "Control", "Shift", " "]
  $: $modifierKeys, handleTempTools()

  function handleTempTools() {
    if ($modifierKeys.length)
      console.log($modifierKeys)

    if (currentTool.hasTempTool() && !$modifierKeys.length)
      toolManager.clearTempTool()
    else if (modifierKeys.equals([" "]))        // pressing just space
      toolManager.switchToolTemp("move")
    else if (modifierKeys.equals([" ", "Shift"]))
      toolManager.switchToolTemp("rotate")
    else if (modifierKeys.equals([" ", "Control"]))
      toolManager.switchToolTemp("zoom")


    tool = $currentTool
    cursorChange()
  }


  onMount(() => {
    layerManager = new LayerManager(baseCanvas, canvasContainer)
    History.setup(layerManager)
    editingCtx = layerManager.getEditingContext()

    pointer = new Pointer(baseCanvas, canvasSize)

    canvasTranslation.setup(baseCanvas)
  })



  function handlePointerDown(e) {
    pointer.set(e)
    drawing = true
    History.addCacheIfNeeded()
    tool.pointerDown(e, pointer, getContextForTool(tool))

    cursorChange()

    layerManager.refreshMainCanvas()
  }

  function handlePointerMove(e) {
    if (drawing) {
      pointer.set(e)
      tool.pointerMove(e)

      cursorChange()


      layerManager.refreshMainCanvas()
    }
  }

  function handlePointerUp(e) {
    pointer.set(e)
    drawing = false
    var saveStep = tool.pointerUp(e)

    layerManager.pushEditingLayer()

    cursorChange()

    if (saveStep)
      History.addStep({ type: 'edit-layer' })
  }

  function handlePointerLost() {
    drawing = false
    var saveStep = tool.cancel()

    layerManager.pushEditingLayer()

    cursorChange()

    if (saveStep)
      History.addStep({ type: 'edit-layer' })
  }





  function handleKeyDown(e) {
    e.preventDefault()

    if (drawing)
      return

      if (modifierKeys.equals(["Control"]) && (pressedKey == e.code || !pressedKey) ) {
        switch(e.code) {
          case 'KeyZ':
            History.undo()
            break
          case 'KeyY':
            History.redo()
        }
      }


    if (modifierKeyNames.includes(e.key)) {
      modifierKeys.add(e.key)
      return
    }
    else if (pressedKey == '')
      pressedKey = e.code
    else
      return


    // shortcuts
    if (!$modifierKeys.length) {              // no modifier keys pressed

      switch(pressedKey) {
        case 'KeyQ':
          toolManager.switchTool("pen")
          break

        case 'KeyE':
          toolManager.switchTool("eraser")
          break

        case 'KeyF':
          canvasTranslation.set({top: 300 * Math.random(), left: 1000 * Math.random(), rotation: 360 * Math.random()})
          console.log($canvasTranslation)
          break

        case 'KeyT':
          canvasTranslation.set({scale: 2 * Math.random()})
          break

        case 'Digit2':
          canvasTranslation.flip()
          break
      }

    }

    else if (modifierKeys.equals(["Shift"])) {   // pressing just shift

      switch(pressedKey) {
        case 'KeyW':
          layerManager.newLayer()
          break
        case 'KeyR':
          layerManager.selectLayerAbove()
          break
        case 'KeyF':
          layerManager.selectLayerBelow()
          break
      }
    }

    else if (modifierKeys.equals(["Control"])) {   // pressing just ctrl

    }

    if (e.key == 'w') {
      tool.changeColor?.("#" + Math.round((Math.random() * 900000 + 100000)).toString())
    }
  }

  function handleKeyUp(e) {
    if (modifierKeyNames.includes(e.key))
      modifierKeys.remove(e.key)

    if (e.code == pressedKey)
      pressedKey = ''

  }
  function handleOnFocus(e) {
    modifierKeys.clear()
    pressedKey = ''

    //cancel drawing operation if needed
    handlePointerLost()
  }

  function getContextForTool(tool) {
    return tool.useEditingLayer ? editingCtx : $currentContext;
  }

  window.onbeforeunload = (event) => { event.preventDefault(); return event.returnValue = "Are you sure you want to leave? You have unsaved changes" }

	$: cssCanvasTranslate = Object.entries($canvasTranslation)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';') + `; --sizeX: ${canvasSize.x}; --sizeY: ${canvasSize.y};`

</script>

<svelte:window
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
  on:blur={handleOnFocus}
></svelte:window>

<ToolSidebar {toolManager}></ToolSidebar>
<main style={cursorCss}
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointerleave={handlePointerLost}>

  <div bind:this={canvasContainer} style={cssCanvasTranslate}>
    <canvas class="{$canvasTranslation.scale > 1.25 ? 'zoom' : 'no-zoom'}" bind:this={baseCanvas} width={canvasSize.x} height={canvasSize.y}></canvas>
  </div>

</main>

<style>
  :global(body) {
    margin: 0;
  }
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  div {
    background-color: white;
    width: calc(var(--sizeX) * 1px);
    height: calc(var(--sizeY) * 1px);
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    transform-origin: top left;
    transform: rotate(calc(var(--rotation) * 1rad * var(--flip))) scale(var(--scale)) scale(var(--flip), 1);
    position: fixed;
  }

  main {
    width: 100vw;
    height: 100vh;
    background-color: gray;
    position: fixed;
    top: 0;
    left: 0;
    cursor: var(--cursor)
  }

  canvas {
    position: absolute;
  }

  .no-zoom {
    image-rendering: crisp-edges;
    image-rendering: -webkit-optimize-contrast;
  }
  .zoom {
    image-rendering: pixelated;
  }
</style>
