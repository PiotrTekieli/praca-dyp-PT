<script>
  import { onMount } from "svelte";

  import { Pointer } from '../src/Pointer.mjs'
  import { Pen } from '../src/Pen.mjs'
  import { Eraser } from '../src/Eraser.mjs'

  let canvasSize = {
    x: 600,
    y: 600
  }
  
  let mainContainer;
  let baseCanvas, editingCanvas;
  let currentCtx = null, editingCtx = null;
  let canvasList = []

  onMount(() => {
    currentCtx = getContext(baseCanvas)

    editingCtx = getContext(editingCanvas)
    canvasList.push(baseCanvas)
  })  
  
  
  var pointer = new Pointer();
  var currentTool = new Pen()
  
  function handlePointerDown(e) {
    pointer.set(e, editingCtx)
        
    currentTool.pointerDown(e, pointer, getContextForTool(currentTool))
  }

  function handlePointerMove(e) {
    pointer.set(e, editingCtx)         
    currentTool.pointerMove(e, pointer, getContextForTool(currentTool))
  }

  function handlePointerUp(e) {
    pointer.set(e, editingCtx)  

    currentTool.pointerUp(e, pointer, getContextForTool(currentTool))
    PushEditingLayer();
  }

  document.onkeydown = function (e) {
    console.log(e.key)
    if (e.key == 'w') {
      editingCtx.fillStyle = "#" + Math.round((Math.random() * 900000 + 100000)).toString();      
    }

    if (e.key == 'f') {
      createCanvas();
    }

    if (e.key == 'r') {
      console.log(canvasList)
      editingCtx.fillStyle = '#444999'
      editingCtx.globalAlpha = '0.5'
      editingCtx.globalCompositeOperation = 'xor'
    }

    if (e.key == 'e') {
      currentTool = new Eraser();
    }

    if (e.key == '2') {
      PutAbove(currentCtx.canvas, 3)
    }
    if (e.key == '3') {
      PutAbove(currentCtx.canvas, 4)
    }
    if (e.key == '4') {
      PutAbove(currentCtx.canvas, 0)
    }
    if (e.key == '5') {
      PutAbove(currentCtx.canvas, 8)
    }
  }

  function createCanvas() {
    var newCanvas = baseCanvas.cloneNode()
    newCanvas.id = canvasList.length

    Clear(getContext(newCanvas))
    canvasList.push(newCanvas)
    currentCtx = getContext(newCanvas)
    mainContainer.appendChild(newCanvas)

    mainContainer.appendChild(editingCanvas); // TODO switch when selecting different layer

    return newCanvas;
  }

  function getContextForTool(tool) {
    return tool.useEditingLayer ? editingCtx : currentCtx;
  }

  function getContext(canvas) {
    return canvas.getContext('2d');
  }

  function Clear(ctx) {
    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);
  }

  function PutAbove(canvas, canvasNumber) {
    var index = canvasList.findIndex((element) => element == canvas);  
    
    canvasList.splice(index, 1);
    
    var tempList = canvasList.slice(0, canvasNumber + 1)
    tempList.push(canvas)
    tempList = tempList.concat(canvasList.slice(canvasNumber + 1))
    
    canvasList = tempList;
    
    canvasList.forEach(c => {
      mainContainer.appendChild(c);
    })
    mainContainer.appendChild(editingCanvas);
  }

  function PushEditingLayer() {
    var img = new Image()
    img.src = editingCanvas.toDataURL()    

    img.onload = () => {
      currentCtx.drawImage(img, 0, 0)
      editingCtx.clearRect(0, 0, canvasSize.x, canvasSize.y);
    }
  }
  
</script>

<svelte:window on:pointerdown={handlePointerDown} on:pointermove={handlePointerMove}  on:pointerup={handlePointerUp} on:pointerleave={handlePointerUp}></svelte:window>

<main bind:this={mainContainer}>
  <canvas bind:this={baseCanvas} width={canvasSize.x} height={canvasSize.y}></canvas>
  <canvas bind:this={editingCanvas} width={canvasSize.x} height={canvasSize.y}></canvas>  
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
  }
</style>
