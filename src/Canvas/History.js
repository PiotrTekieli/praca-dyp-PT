const MAX_STEP_COUNT = 50

let stepIndex
let historyStepList = []
let layerManager
let disableHistory = false

function historyAdd(step) {
    if (!disableHistory) {
        if (layerManager) {
            if (stepIndex != historyStepList.length - 1)                //if not last step
                historyStepList.splice(stepIndex + 1, MAX_STEP_COUNT)   //remove all steps ahead

            console.log(step)

            var lastStep = historyStepList?.[historyStepList.length - 1]

            if (step.type == 'edit-layer' || step.type == 'layer-cache') {
                step.layerId = layerManager.getSelectedLayerIndex()
                step.canvas = layerManager.cloneSelectedCanvas()
            }

            if (step.type != 'edit-layer') {
                if (lastStep?.type == 'layer-cache')
                    historyStepList.splice(historyStepList.length - 1, 1)
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
    },
    addStep: (step) => {
        historyAdd(step)
    },
    addCacheIfNeeded: () => {
        if (historyStepList[stepIndex]?.layerId != layerManager.getSelectedLayerIndex()) {
            historyAdd({ type: 'layer-cache' })
        }
    },
    undo: () => {
        var currentStep = historyStepList[stepIndex]

        if (stepIndex < 0)
            return

        if (stepIndex == 0 && (currentStep.type == 'edit-layer' || currentStep.type == 'layer-cache'))
            return

        if (currentStep.type == 'layer-cache')
            currentStep = historyStepList[--stepIndex]


        console.log("Undoing: " + currentStep.type)

        disableHistory = true
        switch(currentStep.type) {
            case 'edit-layer': {
                var previousStep = historyStepList[stepIndex - 1]
                layerManager.replaceLayer(previousStep.layerId, previousStep.canvas)
                break
            }
            case 'layer-order': {
                revertOrderChange(currentStep.source, currentStep.destination)
                break
            }
        }
        disableHistory = false
        stepIndex--
    },
    redo: () => {

        if (stepIndex + 1 > historyStepList.length - 1)
            return

        var nextStep = historyStepList[++stepIndex]

        if (nextStep.type == 'layer-cache') {
            nextStep = historyStepList[++stepIndex]
        }

        console.log("Redoing: " + nextStep.type)

        disableHistory = true
        switch(nextStep.type) {
            case 'edit-layer': {
                layerManager.replaceLayer(nextStep.layerId, nextStep.canvas)
                break
            }
            case 'layer-order': {
                layerManager.putLayerAbove(nextStep.source, nextStep.destination)
                break
            }
        }
        disableHistory = false
    }
}

function revertOrderChange(source, destination) {
    if (source > destination)
        destination++
    else
        source--

    layerManager.putLayerAbove(destination, source)
}