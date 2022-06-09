<script>
  import Paper from "paper";
import { onMount } from "svelte";
 let canvas;
var paper = new Paper.PaperScope();
var canvasElement = document.getElementById('myCanvas');
  
 onMount(async() => {
    paper.setup(canvas);
		
    var t = new paper.Tool()
    t.onMouseDown = (event) => {
        path = new paper.Path();
        path.add(event.point);
        path.strokeWidth = 3
        path.strokeColor = color
    }
    t.onMouseDrag = (event) => {
        path.add(event.point);
    }

    var path;
    var simplePen = new paper.Tool();
    simplePen.activate()
    
    paper.tool.minDistance = 10;
    var color = new paper.Color(0, 1)
    paper.tool.onMouseDown = (event) => {
        path = new paper.Path();
        path.add(event.point);
        path.strokeColor = color
    }

    paper.tool.onMouseDrag = (event) => {
        path.add(event.point);
    }

    paper.view.on("keydown", (event) => {
      if (event.key == 'f')
        color = new paper.Color(1, 0, 0, 1)

      
      t.activate()
      
    })
  });
  
</script>

<main>
  <canvas bind:this={canvas}></canvas>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>
