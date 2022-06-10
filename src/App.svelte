<script>
  import Paper from "paper";
  import { onMount } from "svelte";

  import { Pointer } from '../src/Pointer.mjs'
  import { Pen } from '../src/Pen.mjs'
  import { Eraser } from '../src/Eraser.mjs'
  
  let canvas;
  var paper = new Paper.PaperScope();

  var pointer = new Pointer();
  var currentTool = new Pen();
  
  onMount(async() => {
    paper.setup(canvas);
	
    var color = new paper.Color(0, 1)
    var eraser = false
    paper.view.on("keydown", (event) => {
      if (event.key == 'f' && !eraser) {
        currentTool = new Eraser()
        eraser = true
        return
      }
      if (eraser) {
        currentTool = new Pen()//color = new paper.Color(1, 0, 0, 1)   
        eraser = false
      }
      
    })
  });

  function setPointer(e) {
    var rect = canvas.getBoundingClientRect();
    pointer.set({ x: e.pageX - rect.left, y: e.pageY - rect.top })
  }

  function handlePointerDown(e) {
    setPointer(e);
    currentTool.pointerDown(e, pointer, paper)
  }

  function handlePointerMove(e) {
    setPointer(e);
    currentTool.pointerMove(e, pointer, paper)
  }
  
</script>

<main>
  <canvas bind:this={canvas} on:pointerdown={handlePointerDown} on:pointermove={handlePointerMove}></canvas>
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
  }

  canvas {
    width: 100%;
    height: 100%;
  }
</style>
