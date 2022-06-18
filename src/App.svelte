<script>
  import { onMount } from "svelte";

  import LayerManager from './Canvas/LayerManager'
  import ToolManager from "./Tools/ToolManager"

  import { currentContext, currentTool, modifierKeys } from "./lib/stores"

  import Pointer from './Canvas/Pointer'
  import Pen from './Tools/Pen'
  import Eraser from './Tools/Eraser'

  let canvasSize = {
    x: 600,
    y: 600
  }

  let canvasContainer
  let baseCanvas

  let layerManager
  let editingCtx

  let pointer
  let toolManager = new ToolManager()

  let drawing = false
  let pressedKey = ''

  $: $currentContext, console.log($currentContext)
  $: $modifierKeys, console.log($modifierKeys)
  $: drawing, console.log("Drawing: ", drawing)
  $: tool = $currentTool
  const modifierKeyNames = ["Alt", "Control", "Shift", " "]


  onMount(() => {
    layerManager = new LayerManager(baseCanvas, canvasContainer)
    editingCtx = layerManager.getEditingContext()

    pointer = new Pointer(baseCanvas)
  })

  function handlePointerDown(e) {
    pointer.set(e)
    drawing = true
    tool.pointerDown(e, pointer, getContextForTool(tool))

    layerManager.refreshMainCanvas()
  }

  function handlePointerMove(e) {
    if (drawing) {
      pointer.set(e)
      tool.pointerMove(e, pointer, getContextForTool(tool))

      layerManager.refreshMainCanvas()
    }
  }

  function handlePointerUp(e) {
    pointer.set(e)
    drawing = false
    tool.pointerUp(e, pointer, getContextForTool(tool))

    layerManager.pushEditingLayer()
  }

  function handlePointerLost() {
    drawing = false
    tool.cancel(pointer, getContextForTool(tool))

    layerManager.pushEditingLayer()
  }



  function handleKeyDown(e) {
    e.preventDefault()

    if (drawing)
      return

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
      }

    }

    else if (modifierKeys.equals(["Shift"])) {   // pressing just shift

      switch(pressedKey) {
        case 'KeyW':
          layerManager.addLayer()
          break
        case 'KeyR':
          layerManager.selectLayerAbove()
          break
        case 'KeyF':
          layerManager.selectLayerBelow()
          break
      }

    }
    /*if (e.key == 'w') {
      editingCtx.fillStyle = "#" + Math.round((Math.random() * 900000 + 100000)).toString();
    }
    if (e.key == 'f') {
      layerManager.addLayer()
    }

    if (e.key == 'r') {
      console.log()
      editingCtx.fillStyle = '#444999'
      editingCtx.globalAlpha = '0.5'
      editingCtx.globalCompositeOperation = 'xor'
    }

    if (e.key == 'e') {
      toolManager.switchToolTemp("eraser")
    }
    if (e.key == 'r') {
      toolManager.clearTempTool()
    }

    if (e.key == '2') {
      layerManager.putSelectedLayerAbove(3)
    }
    if (e.key == '3') {
      layerManager.putSelectedLayerAbove(5)
    }
    if (e.key == '4') {
      layerManager.putSelectedLayerAbove(0)
    }
    if (e.key == '5') {
      layerManager.putSelectedLayerAbove(8)
    }*/
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

</script>

<svelte:window
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
  on:blur={handleOnFocus}
></svelte:window>


<main
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointerleave={handlePointerUp}>

  <div bind:this={canvasContainer}>
    <canvas bind:this={baseCanvas} width={canvasSize.x} height={canvasSize.y}></canvas>
  </div>

</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  div {
    background-color: white;
    width: 600px;
    height: 600px;
    left: 200px;
    position: fixed;
  }

  main {
    width: 100vw;
    height: 100vh;
    background-color: gray;
    position: fixed;
    top: 0;
    left: 0;
  }

  canvas {
    position: absolute;
    image-rendering: crisp-edges;
    image-rendering: -webkit-optimize-contrast;
  }
</style>
