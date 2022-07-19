import { currentTool, toolSettings } from "../lib/stores"
import History from "../Canvas/History"

import Brush from "./Brush"
import Eraser from "./Eraser"
import Move from "./Move"
import Rotate from "./Rotate"
import Zoom from "./Zoom"
import Figure from "./Figure"
import Resize from "./Resize"
import { get } from "svelte/store"

let toolList

export default class ToolManager {
    constructor() {
        toolList = {
            move: new Move(),
            rotate: new Rotate(),
            zoom: new Zoom(),
            brush: new Brush(),
            eraser: new Eraser(),
            figure: new Figure(),
            resize: new Resize()
        }

        this.switchTool("brush")
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

        get(currentTool).copyCursor?.()
    }

    clearTempTool() {
        if (get(currentTool).cancel())
            History.addStep({ type: 'edit-layer' })
        console.log("Tool cleared")
        currentTool.clearTemp()
    }
}