import { get } from "svelte/store"
import { Layer } from "./Layer"
import { currentContext } from "../lib/stores"

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

let layerList = []

export class LayerManager {

    constructor(canvas, container) {
        mainCanvas = canvas

        canvasSize.x = canvas.width
        canvasSize.y = canvas.height

        backCacheLayer = new Layer(canvasSize)
        drawingLayer = new Layer(canvasSize)
        frontCacheLayer = new Layer(canvasSize)

        editingLayer = new Layer(canvasSize)

        this.addLayer()
    }

    addLayer() {
        let layer = new Layer(canvasSize)
        layer.canvas.id = layerList.length.toString()

        if (layerList.length == 0) {
            layerList.push(layer)
            this.selectLayer(0)
            return layer
        }

        if (layerList.length == 2) {
            layer.blendMode = 'source-atop'
            layer.opacity = 0.5
        }

        layerList.splice(selectedLayerIndex+1, 0, layer)    // add above selected

        this.selectLayer(selectedLayerIndex+1)              // and select it
        return layer
    }

    putSelectedLayerAbove(layerIndex) {
        layerIndex += 1

        if (layerIndex > layerList.length - 1)
            layerIndex = layerList.length - 1

        layerList.splice(layerIndex, 0, layerList[selectedLayerIndex])

        if (layerIndex < selectedLayerIndex)
            selectedLayerIndex++
        else
            layerIndex--

        layerList.splice(selectedLayerIndex, 1)

        this.selectLayer(layerIndex)
        this.updateCaches()
    }

    selectLayer(index) {
        currentContext.set(layerList[index].context)
        selectedLayerIndex = index
        editingLayer.blendMode = layerList[selectedLayerIndex].blendMode

        this.updateCaches()
    }

    refreshMainCanvas() {
        clear(drawingLayer.context)
        this.drawLayerPlain(drawingLayer.context, layerList[selectedLayerIndex])
        this.drawLayerPlain(drawingLayer.context, editingLayer)
        drawingLayer.opacity = layerList[selectedLayerIndex].opacity
        drawingLayer.blendMode = layerList[selectedLayerIndex].blendMode


        var ctx = mainCanvas.getContext('2d')

        clear(ctx)
        this.drawLayer(ctx, backCacheLayer)
        this.drawLayer(ctx, drawingLayer)
        this.drawLayer(ctx, frontCacheLayer)
    }

    updateCaches() {            // on change order or change select
        console.log(layerList)
        console.log("Selected layer: ", selectedLayerIndex)
        console.log(get(currentContext))

        clear(backCacheLayer.context)
        clear(frontCacheLayer.context)

        for(let i = 0; i < layerList.length; i++) {
            var context;
            if (i < selectedLayerIndex)
                context = backCacheLayer.context
            /*else if (i == selectedLayerIndex)
                context = drawingLayer.context*/
            else if (i > selectedLayerIndex)
                context = frontCacheLayer.context

            if (context)
                this.drawLayer(context, layerList[i])
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

    pushEditingLayer() {
        var ctx = get(currentContext)

        ctx.save()
        //ctx.globalCompositeOperation = editingLayer.blendMode

        ctx.drawImage(editingLayer.canvas, 0, 0)
        clear(editingLayer.context)

        ctx.restore()
    }
}

function clear(ctx) {
    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);
}
