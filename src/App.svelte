<script>
  import { onMount } from "svelte";

  import { LayerManager } from './Canvas/LayerManager'

  import { Pointer } from './Canvas/Pointer'
  import { Pen } from './Tools/Pen'
  import { Eraser } from './Tools/Eraser'

  let canvasSize = {
    x: 600,
    y: 600
  }
  
  let mainContainer
  let baseCanvas

  let layerManager
  let editingCtx

  let pointer
  let currentTool = new Pen()

  onMount(() => {
    layerManager = new LayerManager(baseCanvas, mainContainer)
    editingCtx = layerManager.getEditingContext()
    
    pointer = new Pointer(baseCanvas)
  })  
  
  function handlePointerDown(e) {
    pointer.set(e)
        
    currentTool.pointerDown(e, pointer, getContextForTool(currentTool))
  }

  function handlePointerMove(e) {
    pointer.set(e)         
    currentTool.pointerMove(e, pointer, getContextForTool(currentTool))
  }

  function handlePointerUp(e) {
    pointer.set(e)

    currentTool.pointerUp(e, pointer, getContextForTool(currentTool))
    layerManager.pushEditingLayer();
  }

  document.onkeydown = function (e) {
    console.log(e.key)
    if (e.key == 'w') {
      editingCtx.fillStyle = "#" + Math.round((Math.random() * 900000 + 100000)).toString();      
    }

    if (e.key == 'f') {
      layerManager.addLayer(layerManager.createLayer())
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

  function getContextForTool(tool) {
    return tool.useEditingLayer ? editingCtx : layerManager.getCurrentContext();
  }
  
</script>

<svelte:window on:pointerdown={handlePointerDown} on:pointermove={handlePointerMove}  on:pointerup={handlePointerUp} on:pointerleave={handlePointerUp}></svelte:window>

<main bind:this={mainContainer}>
  <canvas bind:this={baseCanvas} width={canvasSize.x} height={canvasSize.y}></canvas>  
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    background-color: white;
    width: 600px;
    height: 600px;
    left: 200px;
    position: fixed;
  }

  canvas {
    position: absolute;
    image-rendering: crisp-edges;
    image-rendering: -webkit-optimize-contrast;
  }
</style>
