import { writable } from "svelte/store";

function createSetStore() {
    const { subscribe, set } = writable();

    return {
        subscribe,
        set        
    }
}

export const currentContext = createSetStore()

function createModifierKeysStore() {
    const { subscribe, update, set } = writable([])
    var currentList = []

    return {
        subscribe,
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