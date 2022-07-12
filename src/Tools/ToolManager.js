import { currentTool, toolSettings } from "../lib/stores"
import History from "../Canvas/History"

import Pen from "./Pen"
import Eraser from "./Eraser"
import Move from "./Move"
import Rotate from "./Rotate"
import Zoom from "./Zoom"
import { get } from "svelte/store"

let toolList

export default class ToolManager {
    constructor() {
        toolList = {
            pen: new Pen(),
            eraser: new Eraser(),
            move: new Move(),
            rotate: new Rotate(),
            zoom: new Zoom(),
        }

        this.switchTool("pen")
    }

    getToolList() {
        return toolList
    }

    switchTool(toolName) {

        console.log("Tool switched to: ", toolName)
        if (get(currentTool)) {
            get(currentTool).cancel()
            get(currentTool).saveSettings?.()
        }
        currentTool.set(toolList[toolName])
        toolSettings.setWidth(toolList[toolName]?.strokeWidth)
        toolSettings.setOpacity(toolList[toolName]?.opacity)
        toolSettings.setMode(toolList[toolName]?.mode)
    }

    switchToolTemp(toolName) {
        get(currentTool).cancel()
        console.log("Tool switched to: ", toolName)
        currentTool.setTemp(toolList[toolName])
    }

    clearTempTool() {
        if (get(currentTool).cancel())
            History.addStep({ type: 'edit-layer' })
        console.log("Tool cleared")
        currentTool.clearTemp()
    }
}