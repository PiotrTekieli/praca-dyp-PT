import { layerList } from "../lib/stores"
import { get } from "svelte/store"
import CursorCanvas from "./CursorCanvas"

const MAX_STEP_COUNT = 51

let stepIndex
let historyStepList = []
let layerManager
let disableHistory = false

let layerCache

function historyAdd(step) {
    if (!disableHistory) {
        if (layerManager) {
            if (layerList.isEmpty() && step.type == 'edit-layer')
                return

            if (stepIndex != historyStepList.length - 1)                //if not last step
                historyStepList.splice(stepIndex + 1, MAX_STEP_COUNT)   //remove all steps ahead

            console.log(step)

            if (step.type == 'edit-layer') {
                step.layerId = layerManager.getSelectedLayerIndex()
                step.canvas = layerManager.cloneSelectedCanvas()

                if (layerCache) {
                    step.cache = layerCache
                    step.type = 'first-edit-layer'

                    layerCache = null
                }
            }

            historyStepList.push(step)                                  //add step

            if (historyStepList.length > MAX_STEP_COUNT)
                historyStepList.splice(0, 1)

            stepIndex = historyStepList.length - 1

            console.log(historyStepList)
        }
    }
}

export default {
    setup: (LayerManager) => {
        layerManager = LayerManager
        historyAdd({ type: 'initialize' })
    },
    addStep: (step) => {
        historyAdd(step)
    },
    addCacheIfNeeded: () => {
        if (historyStepList[stepIndex]?.layerId != layerManager.getSelectedLayerIndex()) {
            layerCache = {
                canvas: layerManager.cloneSelectedCanvas()
            }
        }
    },
    undo: () => {
        var currentStep = historyStepList[stepIndex]

        if (stepIndex == 0)
            return

        console.log("Undoing: " + currentStep.type)

        disableHistory = true
        switch(currentStep.type) {
            case 'first-edit-layer': {
                layerManager.replaceLayer(currentStep.layerId, currentStep.cache.canvas)
                break
            }
            case 'edit-layer': {
                var previousStep = historyStepList[stepIndex - 1]
                layerManager.replaceLayer(previousStep.layerId, previousStep.canvas)
                break
            }
            case 'new-layer': {
                currentStep.visible = get(layerList).list[currentStep.index + 1].visible
                layerManager.removeLayer(currentStep.index + 1)
                break
            }
            case 'remove-layer': {
                layerManager.addLayerAbove(currentStep.index-1, currentStep.layer)
                if (get(layerList).selected >= currentStep.index)
                    layerManager.selectLayer(get(layerList).selected+1)
                else
                    layerManager.updateCaches()
                break
            }
            case 'layer-order': {
                revertOrderChange(currentStep.source, currentStep.destination)
                break
            }
            case 'rename-layer': {
                layerList.renameLayer(currentStep.index, currentStep.oldName)
                break
            }
            case 'change-opacity': {
                console.log(currentStep.from)
                layerList.changeOpacity(currentStep.index, currentStep.from)
                layerManager.updateCaches()
                break
            }
            case 'lock-layer': {
                layerList.toggleLock(currentStep.index)
                break
            }
        }
        disableHistory = false
        stepIndex--

        CursorCanvas.update()
    },
    redo: () => {
        if (stepIndex + 1 > historyStepList.length - 1)
            return

        var nextStep = historyStepList[++stepIndex]


        console.log("Redoing: " + nextStep.type)

        disableHistory = true
        switch(nextStep.type) {
            case 'first-edit-layer':
            case 'edit-layer': {
                layerManager.replaceLayer(nextStep.layerId, nextStep.canvas)
                break
            }
            case 'new-layer': {
                let layer = layerManager.addLayerAbove(nextStep.index)
                layer.name = nextStep.name
                layer.visible = nextStep.visible
                break
            }
            case 'remove-layer': {
                layerManager.removeLayer(nextStep.index)
                break
            }
            case 'layer-order': {
                layerManager.putLayerAbove(nextStep.source, nextStep.destination)
                break
            }
            case 'rename-layer': {
                layerList.renameLayer(nextStep.index, nextStep.newName)
                break
            }
            case 'change-opacity': {
                layerList.changeOpacity(nextStep.index, nextStep.to)
                layerManager.updateCaches()
                break
            }
            case 'lock-layer': {
                layerList.toggleLock(nextStep.index)
                break
            }
        }
        disableHistory = false

        CursorCanvas.update()
    }
}

function revertOrderChange(source, destination) {
    if (source > destination)
        destination++
    else
        source--

    layerManager.putLayerAbove(destination, source)
}