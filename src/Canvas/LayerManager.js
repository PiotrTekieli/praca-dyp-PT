import { get } from "svelte/store"
import { Layer } from "./Layer"
import { currentContext, layerList, toolSettings } from "../lib/stores"
import History from './History'

let selectedLayerIndex = 0

let canvasSize = {
    x: 0,
    y: 0
}

let mainCanvas

let backCacheLayer
let drawingLayer
let frontCacheLayer

let editingLayer

let backgroundColor = 'white'   // css color value of the background

export default class LayerManager {
    constructor() {
        layerList.set([])
    }

    setup(canvas, container) {
        mainCanvas = canvas

        canvasSize.x = canvas.width
        canvasSize.y = canvas.height

        backCacheLayer = new Layer(canvasSize)
        drawingLayer = new Layer(canvasSize)
        frontCacheLayer = new Layer(canvasSize)

        editingLayer = new Layer(canvasSize)

        this.newLayer()
    }

    newLayer() {
        this.addLayerAbove(selectedLayerIndex)
        this.selectLayer(selectedLayerIndex+1)
    }

    addLayerAbove(index, layer = null) {
        if (!layer) {
            layer = new Layer(canvasSize)
            layer.name = "Layer " + (get(layerList).list.length + 1)
        }
        layer.canvas.id = get(layerList).list.length.toString()

        History.addStep({ type: 'new-layer', index: index, name: layer.name })

        if (get(layerList).list.length == 0) {
            layerList.set(get(layerList).list.concat(layer))
            this.selectLayer(0)
            return layer
        }

        layerList.splice(index+1, 0, layer)                   // add above index

        //this.selectLayer(index+1)                           // and select it
        return layer
    }

    removeLayer(layerIndex) {
        layerIndex = Math.min(Math.max(layerIndex, 0), get(layerList).list.length-1);

        History.addStep({ type: "remove-layer", index: layerIndex, layer: get(layerList).list[layerIndex] })

        layerList.splice(layerIndex, 1)

        if (layerIndex == selectedLayerIndex)
            this.selectLayer(layerIndex - 1)
        else if (layerIndex < selectedLayerIndex)
            this.selectLayer(selectedLayerIndex - 1)
        else
            this.updateCaches()
    }

    putSelectedLayerAbove(layerIndex) {
        this.putLayerAbove(selectedLayerIndex, layerIndex)
    }

    putLayerAbove(source, destination) {
        if (destination == source || destination == source-1)
            return
        History.addStep({ type: 'layer-order', source: source, destination: destination })

        destination += 1

        source = clamp(source, 0, get(layerList).list.length - 1)
        destination = clamp(destination, 0, get(layerList).list.length)

        var layer = get(layerList).list[source]
        layerList.splice(source, 1)


        if (destination > source)
            destination--

            layerList.splice(destination, 0, layer)

        this.selectLayer(destination)
    }

    selectLayer(index) {
        if (layerList.isEmpty()) {
            this.refreshMainCanvas()
            return
        }

        index = Math.min(Math.max(index, 0), get(layerList).list.length-1);

        currentContext.set(get(layerList).list[index].context)
        selectedLayerIndex = index
        layerList.select(index)

        this.updateCaches()
    }

    selectLayerAbove() {
        if (selectedLayerIndex < get(layerList).list.length - 1)
            this.selectLayer(selectedLayerIndex + 1)
    }

    selectLayerBelow() {
        if (selectedLayerIndex > 0)
            this.selectLayer(selectedLayerIndex - 1)
    }

    refreshMainCanvas() {           // on modifying the current canvas in any way (drawing, opacity or blend mode)
        clear(drawingLayer.context)

        if (layerList.isEmpty()) {
            clear(mainCanvas.getContext('2d'))
            return
        }

        this.drawLayerPlain(drawingLayer.context, get(layerList).list[selectedLayerIndex])
        editingLayer.opacity = get(toolSettings).opacity
        this.drawLayer(drawingLayer.context, editingLayer)
        drawingLayer.opacity = get(layerList).list[selectedLayerIndex].opacity
        drawingLayer.blendMode = get(layerList).list[selectedLayerIndex].blendMode

        var ctx = mainCanvas.getContext('2d')

        clear(ctx)
        this.drawLayer(ctx, backCacheLayer)
        this.drawLayer(ctx, drawingLayer)
        this.drawLayer(ctx, frontCacheLayer)
    }

    updateCaches() {                // on change order, switch selected layer or background color change
        console.log(get(layerList).list)
        //console.log("Selected layer: ", selectedLayerIndex)

        backCacheLayer.context.globalAlpha = 1
        backCacheLayer.context.blendMode = 'source-over'
        backCacheLayer.context.fillStyle = backgroundColor
        backCacheLayer.context.fillRect(0, 0, canvasSize.x, canvasSize.y)
        clear(frontCacheLayer.context)

        for(let i = 0; i < get(layerList).list.length; i++) {
            var context;
            if (i < selectedLayerIndex)
                context = backCacheLayer.context
            else if (i > selectedLayerIndex)
                context = frontCacheLayer.context
            else context = null

            if (context)
                this.drawLayer(context, get(layerList).list[i])
        }

        this.refreshMainCanvas()
    }

    drawLayer(context, layer) {
        context.globalCompositeOperation = layer.blendMode
        context.globalAlpha = layer.opacity
        context.drawImage(layer.canvas, 0, 0)
    }

    drawLayerPlain(context, layer) {
        context.globalCompositeOperation = 'source-over'
        context.globalAlpha = 1
        context.drawImage(layer.canvas, 0, 0)
    }

    getEditingContext() {
        return editingLayer.context
    }

    getSelectedLayerIndex() {
        return selectedLayerIndex
    }

    pushEditingLayer() {
        var ctx = get(currentContext)
        ctx.save()
        ctx.globalAlpha = editingLayer.opacity
        ctx.drawImage(editingLayer.canvas, 0, 0)
        ctx.restore()
        clear(editingLayer.context)
        this.refreshMainCanvas()
    }

    replaceLayer(layerId, canvas) {
        get(layerList).list[layerId].context.save()
        //layerList[layerId].context.globalCompositeOperation = 'copy'
        clear(get(layerList).list[layerId].context)
        get(layerList).list[layerId].context.drawImage(canvas, 0, 0)
        get(layerList).list[layerId].context.restore()

        this.updateCaches()
    }

    cloneSelectedCanvas() {
        var original = get(layerList).list[selectedLayerIndex].canvas
        var canvas = document.createElement("canvas")
        canvas.width = canvasSize.x
        canvas.height = canvasSize.y
        canvas.getContext('2d').drawImage(original, 0, 0)
        return canvas
    }

}

function clear(ctx) {
    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);
}

function clamp(x, a, b) {
    return Math.max( a, Math.min(x, b) )
}