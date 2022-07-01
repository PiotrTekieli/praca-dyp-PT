import { currentTool } from "../lib/stores"
import History from "../Canvas/History"

import Pen from "./Pen"
import Eraser from "./Eraser"
import Move from "./Move"
import { get } from "svelte/store"

let toolList

export default class ToolManager {
    constructor() {
        toolList = {
            pen: new Pen(),
            eraser: new Eraser(),
            move: new Move()
        }

        this.switchTool("pen")
    }

    switchTool(toolName) {
        console.log("Tool switched to: ", toolName)
        if (get(currentTool))
            get(currentTool).cancel()
        currentTool.set(toolList[toolName])
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