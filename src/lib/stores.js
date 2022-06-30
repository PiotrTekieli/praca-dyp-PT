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

    return {
        subscribe,
        set(value) {
            currentState.top = value?.top ?? currentState.top
            currentState.left = value?.left ?? currentState.left
            currentState.scale = value?.scale ?? currentState.scale
            currentState.flip = value?.flip ?? currentState.flip
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
        set: (tool) => {
            set(tool)
            selected = tool
        },
        hasTempTool: () => {
            return temporary != null
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
