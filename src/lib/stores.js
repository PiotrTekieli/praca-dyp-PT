import { Point } from "../Canvas/Point";
import { writable } from "svelte/store";

const scaleSpeed = 1.005
const maxScale = 32
const minScale = 0.1
const screenOffset = 100
const leftOffset = 236

function getCurrentBoundingBox(currentState, baseCanvas) {
    var points = [{x: 0, y: 0}]     // 0
    var canvasSize = {
        x: baseCanvas.width * currentState.scale * currentState.flip,
        y: baseCanvas.height * currentState.scale
    }
    var cos = Math.cos(currentState.rotation)
    var sin = Math.sin(currentState.rotation)

    points.push({                   // 1
        x: canvasSize.x * cos,
        y: canvasSize.x * sin
    })

    points.push({                   // 2
        x: -canvasSize.y * sin,
        y: canvasSize.y * cos
    })

    points.push({                   // 3
        x: points[1].x + points[2].x,
        y: points[1].y + points[2].y
    })

    var maxX = 0, minX = 0, maxY = 0, minY = 0

    points.forEach(point => {
        maxX = Math.max(maxX, point.x)
        minX = Math.min(minX, point.x)

        maxY = Math.max(maxY, point.y)
        minY = Math.min(minY, point.y)
    })


    return {
        currentState: currentState,
        left: minX + currentState.left,
        right: maxX + currentState.left,
        top: minY + currentState.top,
        bottom: maxY + currentState.top
    }
}

function clampToScreen(boundingBox) {
    var currentState = boundingBox.currentState

    if (boundingBox.left > window.innerWidth - screenOffset) {
        currentState.left -= boundingBox.left - window.innerWidth + screenOffset
    }
    if (boundingBox.right < 0 + screenOffset + leftOffset) {
        currentState.left -= boundingBox.right - screenOffset - leftOffset
    }
    if (boundingBox.top > window.innerHeight - screenOffset) {
        currentState.top -= boundingBox.top - window.innerHeight + screenOffset
    }
    if (boundingBox.bottom < 0 + screenOffset) {
        currentState.top -= boundingBox.bottom - screenOffset
    }
    currentState.scale = Math.max(minScale, Math.min(maxScale, currentState.scale))

    return currentState
}

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

            set(clampToScreen(getCurrentBoundingBox(currentState, baseCanvas)))
        },
        rotate: (rad) => {
            var windowCenter = {
                x: window.innerWidth * 0.5,
                y: window.innerHeight * 0.5
            }

            var sin = Math.sin(rad)
            var cos = Math.cos(rad)

            // rotate center around left corner
            var xnew = currentState.left + (windowCenter.x - currentState.left) * cos - (windowCenter.y - currentState.top) * sin
            var ynew = currentState.top + (windowCenter.x - currentState.left) * sin + (windowCenter.y - currentState.top) * cos

            var difference = {
                x: xnew - windowCenter.x,
                y: ynew - windowCenter.y,
            }

            // move canvas by the difference
            currentState.rotation += rad * currentState.flip
            currentState.left -= difference.x
            currentState.top -= difference.y


            set(clampToScreen(getCurrentBoundingBox(currentState, baseCanvas)))
        },
        zoom: (amount, origin) => {
            if (currentState.scale >= maxScale && amount > 0)
                return
            else if (currentState.scale <= minScale && amount < 0)
                return

            var zoom = Math.pow(scaleSpeed, amount)
            currentState.scale *= zoom

            var differenceFromOrigin = origin.Subtract(new Point(currentState.left, currentState.top))

            differenceFromOrigin = differenceFromOrigin.Multiply(zoom)

            currentState.left = origin.x - differenceFromOrigin.x
            currentState.top = origin.y - differenceFromOrigin.y

            set(clampToScreen(getCurrentBoundingBox(currentState, baseCanvas)))
        },
        flip: () => {
            let rad = currentState.rotation
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

            set(clampToScreen(getCurrentBoundingBox(currentState, baseCanvas)))
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



function createToolSettingsStore() {
    const { subscribe, set } = writable()
    let settings = {
        width: 1,
        selectedColor: 0,
        colors: ["#000000", "#FFFFFF"],
        opacity: 1
    }

    return {
        subscribe,
        set: (options) => {
            settings.width = options?.width ?? settings.width
            settings.opacity = options?.opacity ?? settings.opacity
            set(settings)
        },
        setColor: (color) => {
            settings.colors[settings.selectedColor] = color
            set(settings)
        },
        switchColor: () => {
            settings.selectedColor = 1 - settings.selectedColor
            set(settings)
        }
    }
}

export const toolSettings = createToolSettingsStore()