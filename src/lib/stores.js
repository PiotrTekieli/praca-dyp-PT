import { writable } from "svelte/store";

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
