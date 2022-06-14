var canvasSize = {
    x: 0,
    y: 0
}

var mainContainer
var baseLayer
var editingLayer

var layerList = []

var currentCtx

export class LayerManager {

    constructor(baseCanvas, main) {
        mainContainer = main

        baseLayer = baseCanvas
        baseLayer.id = "0"
        canvasSize.x = baseLayer.width
        canvasSize.y = baseLayer.height
        
        editingLayer = this.createLayer()
        editingLayer.id = "editing"
        this.addLayer(baseLayer)
    }

    createLayer() {
        var newLayer = baseLayer.cloneNode()
        clear(getContext(newLayer))
        return newLayer; 
    }

    addLayer(layer) {
        layerList.push(layer)
        layer.id = layerList.length-1        
        
        var position = 0
        if (currentCtx)
            position = this.getLayerIndex(currentCtx.canvas)
        currentCtx = getContext(layer)
        this.putSelectedLayerAbove(position)
        
    }

    putSelectedLayerAbove(layerIndex) {
        var layer = currentCtx.canvas
        var currentIndex = this.getLayerIndex(layer)
        
        layerList.splice(currentIndex, 1);
        
        var tempList = layerList.slice(0, layerIndex + 1)
        tempList.push(layer)
        tempList = tempList.concat(layerList.slice(layerIndex + 1))
        
        layerList = tempList;
        this.updateOrder()
    }

    updateOrder() {            
        layerList.forEach(c => {
            mainContainer.appendChild(c)
            if (c == currentCtx.canvas)
                mainContainer.appendChild(editingLayer);
        })
        
    }

    selectLayer(index) {
        currentCtx = layerList[index]
    }

    getLayerIndex(layer) {
        return layerList.findIndex((element) => element == layer);  
    }

    getCurrentContext() {
        return currentCtx
    }

    getEditingContext() {
        return getContext(editingLayer)
    }

    pushEditingLayer() {
        this.getCurrentContext().drawImage(editingLayer, 0, 0)
        this.getEditingContext().clearRect(0, 0, canvasSize.x, canvasSize.y);
    }
}

function getContext(canvas) {
    return canvas.getContext('2d');
}

function clear(ctx) {
    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);
}
    