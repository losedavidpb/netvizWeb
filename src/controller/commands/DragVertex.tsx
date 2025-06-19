import * as THREE from 'three';

import type { GLWindow } from "../../gui/GLWindow";
import type { Command } from "../Command";

/**
 * DragVertex :: Command to drag the selected vertex
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class DragVertex implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private window: GLWindow;
    private mouseDiff: THREE.Vector2 | null;
    private translateZ: number;

    /**
     * Constructor for DragVertex
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
        this.mouseDiff = null;
        this.translateZ = -1;
    }

    /**
     * Set the mouse diff
     *
     * @param mouseDiff new mouse diff
     */
    setMouseDiff(mouseDiff: THREE.Vector2): void {
        this.mouseDiff = mouseDiff;
    }

    /**
     * Set the Z-coord of the translate
     *
     * @param translateZ Z-coord of translate
     */
    setTranslateZ(translateZ: number): void {
        this.translateZ = translateZ;
    }

    execute(): void {
        if (this.mouseDiff !== null && this.translateZ !== -1) {
            const selectedNode = this.window.getSelectedNode();

            if (selectedNode !== null) {
                const pos = selectedNode.getPos();

                selectedNode.setPos({
                    x: pos.x - this.mouseDiff.x * .2 * this.translateZ,
                    y: pos.y + this.mouseDiff.y * .2 * this.translateZ
                });

                this.window.refresh(true, false);
            }
        }
    }
}