<script>
  import { onMount } from "svelte";

  import { LayerManager } from './Canvas/LayerManager'
  import { currentContext, modifierKeys } from "./lib/stores";

  import { Pointer } from './Canvas/Pointer'
  import { Pen } from './Tools/Pen'
  import { Eraser } from './Tools/Eraser'

  let canvasSize = {
    x: 600,
    y: 600
  }
  
  let canvasContainer
  let baseCanvas

  let layerManager
  let editingCtx

  let pointer
  let currentTool = new Pen()

  let drawing = false

  $: $currentContext, console.log($currentContext)
  $: $modifierKeys, console.log($modifierKeys)
  $: drawing, console.log("Drawing: ", drawing)
  const modifierKeyNames = ["Alt", "Control", "Shift", " "]


  onMount(() => {
    layerManager = new LayerManager(baseCanvas, canvasContainer)
    editingCtx = layerManager.getEditingContext()
    
    pointer = new Pointer(baseCanvas)
  })  
  
  function handlePointerDown(e) {
    pointer.set(e)
    drawing = true
    currentTool.pointerDown(e, pointer, getContextForTool(currentTool))
  }

  function handlePointerMove(e) {
    pointer.set(e)
    currentTool.pointerMove(e, pointer, getContextForTool(currentTool))
    layerManager.refreshMainCanvas()
  }

  function handlePointerUp(e) {
    pointer.set(e)
    drawing = false
    currentTool.pointerUp(e, pointer, getContextForTool(currentTool))
    layerManager.pushEditingLayer();
  }

  function handlePointerLost() {
    drawing = false
    currentTool.cancel(pointer, getContextForTool(currentTool))
  }

  function handleKeyDown(e) {
    if (drawing)
      return

    if (modifierKeyNames.includes(e.key))
      modifierKeys.add(e.key)

    if (e.key == 'w') {
      editingCtx.fillStyle = "#" + Math.round((Math.random() * 900000 + 100000)).toString();      
    }
    if (e.key == 'q') {
      layerManager.refreshMainCanvas()
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
      currentTool = new Eraser();
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
    }
  }

  function handleKeyUp(e) {
    if (modifierKeyNames.includes(e.key))
      modifierKeys.remove(e.key)
  }
  function handleOnFocus(e) {
    modifierKeys.clear()
    
    //cancel drawing operation if needed
    handlePointerLost()
  }

  function getContextForTool(tool) {
    return tool.useEditingLayer ? editingCtx : $currentContext;
  }
  
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
