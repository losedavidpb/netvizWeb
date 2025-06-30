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

    private readonly window: GLWindow;

    private mouseDiff: THREE.Vector2 | undefined;
    private translateZ: number = -1;

    /**
     * Creates a new DragVertex instance.
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
    }

    /**
     * Updates the mouse diff.
     *
     * @param mouseDiff new mouse diff
     */
    setMouseDiff(mouseDiff: THREE.Vector2): void {
        this.mouseDiff = mouseDiff;
    }

    /**
     * Updates the Z-coord of the translate.
     *
     * @param translateZ Z-coord of translate
     */
    setTranslateZ(translateZ: number): void {
        this.translateZ = translateZ;
    }

    execute(): void {
        if (this.mouseDiff !== undefined && this.translateZ !== -1) {
            const selectedNode = this.window.getSelectedNode();

            if (selectedNode !== null) {
                const pos = selectedNode.getPos();

                selectedNode.setPos({
                    x: pos.x - this.mouseDiff.x * 0.05 * this.translateZ,
                    y: pos.y + this.mouseDiff.y * 0.05 * this.translateZ
                });

                this.window.refresh(true, true);
            }
        }
    }
}