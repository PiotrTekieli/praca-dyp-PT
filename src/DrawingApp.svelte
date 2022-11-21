<script>
  import { onMount } from "svelte";

  import LayerManager from './Canvas/LayerManager'
  import ToolManager from "./Tools/ToolManager"
  import History from "./Canvas/History"

  import CursorCanvas from "./Canvas/CursorCanvas";

  import { canvasTranslation, currentContext, currentTool, modifierKeys, toolSettings, layerList } from "./lib/stores"

  import { Point } from "./Canvas/Point"
  import Pointer from './Canvas/Pointer'
  import ToolSidebar from "./UI/ToolSidebar.svelte"
  import LayerSidebar from "./UI/LayerSidebar.svelte"
  import TopBar from "./UI/TopBar.svelte";
  import RenameWindow from "./UI/RenameWindow.svelte";

  let fileName = "Illustration"

  let canvasSize = {
    x: 1000,
    y: 800
  }

  let mainContainer
  let canvasContainer
  let baseCanvas

  let layerManager = new LayerManager()
  let editingCtx

  let pointer
  let toolManager = new ToolManager()
  let tool

  let drawing = false
  let pressedKey = ''

  let cursorCss

  $: $currentTool, CursorCanvas.update()
  $: $layerList.list, ($layerList.list.length <= 1) ? CursorCanvas.update() : null
  $: $canvasTranslation, CursorCanvas.update()
  $: drawing, console.log("Drawing: ", drawing)
  $: {
    tool = $currentTool
    cursorChange()
  }

  function cursorChange() {
    cursorCss = `--cursor: none`
    return
    if (tool?.cursor == 'circle' || tool?.cursor == 'square') {
      return
    }
    cursorCss = `--cursor: ${tool?.cursor ?? 'default'}`
    if ($modifierKeys.includes("Control"))
      cursorCss = `--cursor: 'default'`
  }

  const modifierKeyNames = ["Alt", "Control", "Shift", " "]
  $: $modifierKeys, handleTempTools()

  function handleTempTools() {
    if ($modifierKeys.length)
      console.log($modifierKeys)

    if (modifierKeys.equals([" "]))        // pressing just space
      toolManager.switchToolTemp("move")
    else if (modifierKeys.equals([" ", "Shift"]))
      toolManager.switchToolTemp("rotate")
    else if (modifierKeys.equals([" ", "Control"]))
      toolManager.switchToolTemp("zoom")
    else if (modifierKeys.equals(["Alt", "Control"]))
      toolManager.switchToolTemp("resize")
    else if (currentTool.hasTempTool())
      toolManager.clearTempTool()

    tool = $currentTool
    cursorChange()
  }


  onMount(() => {
    layerManager.setup(baseCanvas, canvasContainer)
    History.setup(layerManager)
    editingCtx = layerManager.getEditingContext()

    pointer = new Pointer(baseCanvas, canvasSize)

    canvasTranslation.setup(baseCanvas, mainContainer)
    canvasTranslation.centerView()


    CursorCanvas.setup(mainContainer, baseCanvas)
  })



  function handlePointerDown(e) {
    if (e.button != 0)
      return
    if (layerList.isEmpty() && tool?.editingTool)
      return

    if (tool?.editingTool)
      History.addCacheIfNeeded()
    pointer.set(e)
    drawing = true
    tool.pointerDown(e, pointer, getContextForTool(tool))

    cursorChange()

    layerManager.refreshMainCanvas()
    CursorCanvas.update(e)
  }

  function handlePointerMove(e) {
    if (!checkForPen(e))
      return

    CursorCanvas.update(e)

    if (layerList.isEmpty() && tool?.editingTool)
      return

    if (drawing) {
      pointer.set(e)
      tool.pointerMove(e)

      cursorChange()

      layerManager.refreshMainCanvas()
    }
  }

  function handlePointerUp(e) {
    if (e.button != 0)
      return
    if (layerList.isEmpty() && tool?.editingTool)
      return

    pointer.set(e)
    drawing = false
    var saveStep = tool.pointerUp(e)

    layerManager.pushEditingLayer()

    cursorChange()

    if (saveStep)
      History.addStep({ type: 'edit-layer' })

    CursorCanvas.update(e)
  }

  function handlePointerLost() {
    if (layerList.isEmpty() && tool?.editingTool)
      return

    drawing = false
    var saveStep = tool.cancel()

    layerManager.pushEditingLayer()

    cursorChange()

    if (saveStep)
      History.addStep({ type: 'edit-layer' })

    CursorCanvas.clear()
  }

  function handleMouseWheel(e) {
    e.preventDefault()
    if (modifierKeys.equals(["Shift"]))
      canvasTranslation.rotate(Math.sign(e.deltaY) * Math.PI / 180 * 15)
    else
      canvasTranslation.zoom(-Math.sign(e.deltaY) * 30, new Point(e.pageX, e.pageY))
  }


  let disableKeybinds = false
  function handleKeyDown(e) {
    if (disableKeybinds)
      return
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
        case 'F2':
          let renameWindow = new RenameWindow({
            target: document.body
          })
          disableKeybinds = true
          renameWindow.$on("finish", () => disableKeybinds = false)
          break

        case 'KeyQ':
          toolManager.switchTool("brush")
          break

        case 'KeyE':
          toolManager.switchTool("eraser")
          break

        case 'KeyF':
          toolManager.switchTool("figure")
          break

        case 'KeyT':
          canvasTranslation.set({scale: 2 * Math.random()})
          break

        case 'Digit2':
          canvasTranslation.flip()
          break

        case 'KeyX':
          toolSettings.switchColor()
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
      switch(pressedKey) {
        case 'Delete':
          layerManager.removeLayer($layerList.selected)
          break
      }
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


  // needed to work with windows ink
  let _mouseCounter = 0
  function checkForPen(event) {
    if (event.pointerType == "mouse")
      _mouseCounter++

    if (event.pointerType == "pen") {
      _mouseCounter = 0
      return true
    }

    if (_mouseCounter >= 3)
      return true
    return false
  }

  window.onbeforeunload = (event) => { event.preventDefault(); return event.returnValue = "Are you sure you want to leave? You have unsaved changes" }

	$: cssCanvasTranslate = Object.entries($canvasTranslation)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';') + `; --sizeX: ${canvasSize.x}; --sizeY: ${canvasSize.y};`

</script>

<svelte:body
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointerleave={handlePointerLost}
></svelte:body>

<svelte:window
  on:keydown={handleKeyDown}
  on:keyup={handleKeyUp}
  on:blur={handleOnFocus}

  on:touchmove|preventDefault

  on:resize={() => CursorCanvas.resize()}
></svelte:window>

<main>
  <TopBar fileProperties={{name: fileName, canvasSize: canvasSize}}></TopBar>
  <ToolSidebar {toolManager}></ToolSidebar>
  <LayerSidebar {layerManager}></LayerSidebar>
  <div id="mainContainter" bind:this={mainContainer} style={cursorCss}
    on:pointerdown={handlePointerDown}

    on:wheel={handleMouseWheel}>

    <div id="canvasContainer" bind:this={canvasContainer} style={cssCanvasTranslate}>
      <canvas class="{$canvasTranslation.scale > 2.50 ? 'zoom' : 'no-zoom'}" bind:this={baseCanvas} width={canvasSize.x} height={canvasSize.y}></canvas>
    </div>

  </div>
</main>


<style>
  #canvasContainer {
    background-color: white;
    width: calc(var(--sizeX) * 1px);
    height: calc(var(--sizeY) * 1px);
    top: calc(var(--top) * 1px);
    left: calc(var(--left) * 1px);
    transform-origin: top left;
    transform: rotate(calc(var(--rotation) * 1rad * var(--flip))) scale(var(--scale)) scale(var(--flip), 1);
    position: fixed;
    z-index: -1;
  }

  main {
    --leftUIoffset: 236px;
    --rightUIoffset: 200px;
    --topUIoffset: 22px;

    height: 100vh;
    width: 100vw;
    background-color: rgb(102, 102, 105);
  }

  #mainContainter {
    width: calc(100vw - var(--leftUIoffset) - var(--rightUIoffset));
    height: calc(100vh - var(--topUIoffset));
    position: fixed;
    top: var(--topUIoffset);
    left: var(--leftUIoffset);
    cursor: var(--cursor)
  }

  canvas {
    position: absolute;
  }

  .no-zoom {
    image-rendering: auto;
  }
  .zoom {
    image-rendering: pixelated;
  }
</style>
