import { writable } from "svelte/store";

function createCanvasTranslationStore() {
    var currentState = {
        top: 0,
        left: 100,
        scale: 1,
        flip: 1,
        rotation: 0
    }
    const { subscribe, set } = writable(currentState)

    var baseCanvas
    var canvasSize

    return {
        subscribe,
        setup: (canvas) => {
            baseCanvas = canvas
            canvasSize = {
                x: baseCanvas.width,
                y: baseCanvas.height
            }
        },
        move: (x, y) => {
            currentState.left += x
            currentState.top += y

            set(currentState)
        },
        rotate: (deg) => {
            var windowCenter = {
                x: window.innerWidth * 0.5,
                y: window.innerHeight * 0.5
            }

            var angle = deg * (Math.PI / 180)
            var sin = Math.sin(angle)
            var cos = Math.cos(angle)


            // rotate center around left corner
            var xnew = currentState.left + (windowCenter.x - currentState.left) * cos - (windowCenter.y - currentState.top) * sin
            var ynew = currentState.top + (windowCenter.x - currentState.left) * sin + (windowCenter.y - currentState.top) * cos

            var difference = {
                x: xnew - windowCenter.x,
                y: ynew - windowCenter.y,
            }

            // move canvas by the difference
            currentState.rotation += deg * currentState.flip
            currentState.left -= difference.x
            currentState.top -= difference.y


            set(currentState)
        },
        flip: () => {
            let rad = currentState.rotation / 180 * Math.PI
            let rotationCorrection = Math.cos(rad) * canvasSize.x - Math.sin(rad) * canvasSize.y
            rotationCorrection *= currentState.flip * currentState.scale

            let rect = baseCanvas.getBoundingClientRect();
            let centerOffset = (rect.left + (rect.right - rect.left) / 2) - currentState.left
            let centerX = currentState.left + centerOffset
            let newPosX = window.innerWidth - centerX - centerOffset

            currentState.flip = -currentState.flip
            currentState.left = newPosX + rotationCorrection
            set(currentState)
        },
        set: (value) => {
            currentState.top = value?.top ?? currentState.top
            currentState.left = value?.left ?? currentState.left
            currentState.scale = value?.scale ?? currentState.scale
            //currentState.flip = value?.flip ?? currentState.flip
            currentState.rotation = value?.rotation ?? currentState.rotation

            set(currentState)
        }
    }
}

export const canvasTranslation = createCanvasTranslationStore()

function createSetStore() {
    const { subscribe, set } = writable();

    return {
        subscribe,
        set
    }
}

export const currentContext = createSetStore()

function createToolStore() {
    const { subscribe, set } = writable();
    let selected, temporary

    return {
        subscribe,
        set: (tool, temp) => {
            set(tool)
            if (!temp)
                selected = tool
        },
        hasTempTool: () => {
            return (temporary != null)
        },
        setTemp: (tool) => {
            set(tool)
            temporary = tool
        },
        clearTemp: () => {
            if (temporary) {
                set(selected)
                temporary = null
            }
        }
    }
}


export const currentTool = createToolStore()

function createModifierKeysStore() {
    const { subscribe, update, set } = writable([])
    var currentList = []

    return {
        subscribe,
        equals: (array) => {
            return currentList.length === array.length && currentList.every((value) => array.includes(value))
        },
        add: (key) => {
            if (!currentList.includes(key))
                update(list => {
                    currentList = [...list, key]
                    return currentList
                })
        },
        remove: (key) => {
            if (currentList.includes(key))
                update(list => {
                    currentList = list.filter(element => element != key)
                    return currentList
                })
        },
        clear: () => update(l => []),
        set
    }
}

export const modifierKeys = createModifierKeysStore()
