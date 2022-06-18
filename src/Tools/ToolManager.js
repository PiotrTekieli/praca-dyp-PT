import { currentTool } from "../lib/stores"

import Pen from "./Pen"
import Eraser from "./Eraser"
import { get } from "svelte/store"

let toolList

export default class ToolManager {
    constructor() {
        toolList = {
            pen: new Pen(),
            eraser: new Eraser()
        }

        this.switchTool("pen")
    }

    switchTool(toolName) {
        console.log("Tool switched to: ", toolName)
        toolList[toolName].cancel()
        currentTool.set(toolList[toolName])
    }

    switchToolTemp(toolName) {
        toolList[toolName].cancel()
        currentTool.setTemp(toolList[toolName])
    }

    clearTempTool() {
        get(currentTool).cancel()
        currentTool.clearTemp()
    }
}