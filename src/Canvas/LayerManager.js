import { writable, get } from "svelte/store"
import { Layer } from "./Layer"
import { currentContext } from "../lib/stores"

var canvasSize = {
    x: 0,
    y: 0
}

var mainContainer
var baseLayer
var editingLayer

var layerList = []

export class LayerManager {

    constructor(baseCanvas, main) {

        mainContainer = main

        baseCanvas.id = "0"
        canvasSize.x = baseCanvas.width
        canvasSize.y = baseCanvas.height
        baseLayer = new Layer(baseCanvas)
        
        editingLayer = this.createLayer()
        editingLayer.canvas.id = "editing"
        
        this.addLayer(baseLayer)
        
    }

    createLayer() {
        var newLayer = new Layer(baseLayer.canvas.cloneNode())
        clear(newLayer.context)
        return newLayer; 
    }

    addLayer(layer) {
        layerList.push(layer)
        layer.canvas.id = layerList.length-1    
          
        
        var position = 0
        if (get(currentContext))
            position = this.getCanvasIndex(get(currentContext).canvas)
            
        currentContext.set(layer.context)
        this.putSelectedLayerAbove(position)
        
    }

    putSelectedLayerAbove(layerIndex) {        
        var layer = new Layer(get(currentContext).canvas)
        var currentIndex = this.getCanvasIndex(get(currentContext).canvas)
        
        layerList.splice(currentIndex, 1);
        
        var tempList = layerList.slice(0, layerIndex + 1)
        tempList.push(layer)
        tempList = tempList.concat(layerList.slice(layerIndex + 1))
        console.log(tempList)
        
        layerList = tempList;
        this.updateOrder()
    }

    updateOrder() {            
        layerList.forEach(l => {
            mainContainer.appendChild(l.canvas)
            if (l.canvas == get(currentContext).canvas)
                mainContainer.appendChild(editingLayer.canvas);
        })
        
    }

    selectLayer(index) {
        currentContext.set(layerList[index].context)
    }
    
    getCurrentContext() {
        return get(currentContext)
    }
    
    getEditingContext() {
        return editingLayer.context
    }
    
    pushEditingLayer() {
        this.getCurrentContext().drawImage(editingLayer.canvas, 0, 0)
        this.getEditingContext().clearRect(0, 0, canvasSize.x, canvasSize.y);
    }

    getCanvasIndex(canvas) {
        return layerList.findIndex((element) => element.canvas == canvas);  
    }
}

function clear(ctx) {
    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);
}
    