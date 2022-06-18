import { currentTool } from "../lib/stores"

import Pen from "./Pen"
import Eraser from "./Eraser"

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
        currentTool.set(toolList[toolName])
    }

    switchToolTemp(toolName) {
        currentTool.setTemp(toolList[toolName])
    }

    clearTempTool() {
        currentTool.clearTemp()
    }
}