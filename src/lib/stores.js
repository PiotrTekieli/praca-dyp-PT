import CursorCanvas from "../Canvas/CursorCanvas";
import { Point } from "../Canvas/Point";
import { writable, get } from "svelte/store";

const scaleSpeed = 1.01
const maxScale = 32
const minScale = 0.1
const screenOffset = 50
//const leftOffset = 236

function getCurrentBoundingBox(currentState, baseCanvas) {
    var points = [{x: 0, y: 0}]     // 0
    var canvasSize = {
        x: baseCanvas.width * currentState.scale * currentState.flip,
        y: baseCanvas.height * currentState.scale
    }
    var cos = Math.cos(currentState.rotation * currentState.flip)
    var sin = Math.sin(currentState.rotation * currentState.flip)

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

function clampToScreen(boundingBox, main) {
    var currentState = boundingBox.currentState
    var mainRect = main.getBoundingClientRect()
    if (boundingBox.left > mainRect.right - screenOffset) {
        currentState.left -= boundingBox.left - mainRect.right + screenOffset
    }
    if (boundingBox.right < 0 + screenOffset + mainRect.left) {
        currentState.left -= boundingBox.right - screenOffset - mainRect.left
    }
    if (boundingBox.top > mainRect.bottom - screenOffset) {
        currentState.top -= boundingBox.top - mainRect.bottom + screenOffset
    }
    if (boundingBox.bottom < 0 + screenOffset + mainRect.top) {
        currentState.top -= boundingBox.bottom - screenOffset - mainRect.top
    }
    currentState.scale = Math.max(minScale, Math.min(maxScale, currentState.scale))

    return currentState
}

function getScreenCenter(main) {
    var rect = main.getBoundingClientRect()

    var screenCenter = {
        x: (rect.left + rect.right) * 0.5,
        y: (rect.top + rect.bottom) * 0.5
    }
    canvasTranslation.setCenter(screenCenter)

    return screenCenter
}

function createCanvasTranslationStore() {
    var currentState = {
        top: 0,
        left: 0,
        scale: 1,
        flip: 1,
        rotation: 0,
        screenCenter: {
            x: window.innerWidth * 0.5,
            y: window.innerHeight * 0.5
        }
    }
    const { subscribe, set } = writable(currentState)

    var baseCanvas
    var canvasSize
    var mainContainer

    return {
        subscribe,
        setup: (canvas, main) => {
            baseCanvas = canvas
            mainContainer = main
            canvasSize = {
                x: baseCanvas.width,
                y: baseCanvas.height
            }
        },
        centerView: () => {
            var windowCenter = getScreenCenter(mainContainer)
            currentState.left = windowCenter.x - canvasSize.x * 0.5
            currentState.top = windowCenter.y - canvasSize.y * 0.5
        },
        move: (x, y) => {
            currentState.left += x
            currentState.top += y

            set(clampToScreen(getCurrentBoundingBox(currentState, baseCanvas), mainContainer))
        },
        rotate: (rad) => {
            var windowCenter = getScreenCenter(mainContainer)

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


            set(clampToScreen(getCurrentBoundingBox(currentState, baseCanvas), mainContainer))
        },
        zoom: (amount, origin) => {
            if (currentState.scale >= maxScale && amount > 0)
                return
            else if (currentState.scale <= minScale && amount < 0)
                return

            var zoom = Math.pow(scaleSpeed, amount)
            if (currentState.scale * zoom > maxScale)
                zoom = maxScale / currentState.scale

            if (currentState.scale * zoom < minScale)
                zoom = minScale / currentState.scale

            currentState.scale *= zoom

            var differenceFromOrigin = origin.Subtract(new Point(currentState.left, currentState.top))

            differenceFromOrigin = differenceFromOrigin.Multiply(zoom)

            currentState.left = origin.x - differenceFromOrigin.x
            currentState.top = origin.y - differenceFromOrigin.y

            set(clampToScreen(getCurrentBoundingBox(currentState, baseCanvas), mainContainer))
        },
        flip: () => {
            let rad = currentState.rotation
            let rotationCorrection = Math.cos(rad) * canvasSize.x - Math.sin(rad) * canvasSize.y
            rotationCorrection *= currentState.flip * currentState.scale

            let rect = baseCanvas.getBoundingClientRect();
            let centerOffset = (rect.left + (rect.right - rect.left) / 2) - currentState.left
            let centerX = currentState.left + centerOffset
            let mainRect = mainContainer.getBoundingClientRect()
            let newPosX = mainRect.left - centerX - centerOffset + mainRect.right

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

            set(clampToScreen(getCurrentBoundingBox(currentState, baseCanvas), mainContainer))
        },
        setCenter: (center) => {
            currentState.screenCenter = center
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
        getSelected: () => {
            return selected
        },
        hasTempTool: () => {
            return (temporary != null)
        },
        setTemp: (tool) => {
            set(tool)
            CursorCanvas.update()
            temporary = tool
        },
        clearTemp: () => {
            if (temporary) {
                set(selected)
                CursorCanvas.update()
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
        opacity: 1,
        mode: 0
    }

    return {
        subscribe,
        setWidth: (width) => {
            settings.width = Math.round(width * 10) / 10
            set(settings)
        },
        setOpacity: (opacity) => {
            settings.opacity = opacity
            set(settings)
        },
        setMode: (mode) => {
            settings.mode = mode
            get(currentTool).switchMode?.(mode)

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


function createLayerListStore() {
    const { subscribe, set } = writable()

    let layerList = {
        list: [],
        selected: 0
    }

    return {
        subscribe,
        splice: (...args) => {
            // @ts-ignore
            layerList.list.splice(...args)
            set(layerList)
        },
        set: (list) => {
            layerList.list = list
            set(layerList)
        },
        select: (index) => {
            layerList.selected = index
            set (layerList)
        },
        renameLayer: (index, name) => {
            layerList.list[index].name = name
            set(layerList)
        },
        changeOpacity: (index, opacity) => {
            layerList.list[index].opacity = opacity
            set(layerList)
        },
        isEmpty: () => {
            return layerList.list.length == 0
        }
    }
}

export const layerList = createLayerListStore()
