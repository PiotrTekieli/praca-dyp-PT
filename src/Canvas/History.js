const MAX_STEP_COUNT = 50

let stepIndex
let historyStepList = []
let layerManager

function historyAdd(step) {   
    if (stepIndex != historyStepList.length - 1)                //if not last step
        historyStepList.splice(stepIndex + 1, MAX_STEP_COUNT)   //remove all steps ahead
        
    if (step.name == 'edit-layer') { 
        step.layerId = layerManager.getSelectedLayerIndex()
        step.canvas = layerManager.cloneSelectedCanvas()
    }
    historyStepList.push(step)                                  //add step
    
    if (historyStepList.length > MAX_STEP_COUNT)
        historyStepList.splice(0, 1)
    
    stepIndex = historyStepList.length - 1

    //console.log(historyStepList[1].canvas.toDataURL())
}

export default {
    setup: (LayerManager) => {
        layerManager = LayerManager
    },
    addStep: (step) => {
        historyAdd(step)
    },
    undo: () => {
        var currentStep = historyStepList[stepIndex]

        switch(currentStep.name) {
            case 'edit-layer': {
                layerManager.replaceLayer(currentStep.layerId, historyStepList[stepIndex - 1].canvas)
                stepIndex--
                break
            }
        }
    }
}