import * as THREE from 'three';

import type { GLWindow } from "../../gui/GLWindow";
import type { Command } from "../Command";
import type { Vertex } from '../../model/Vertex';

/**
 * SelectVertex :: Command to select a vertex
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class SelectVertex implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private readonly window: GLWindow;
    private mousePosition: THREE.Vector2 | null;

    /**
     * Creates a new SelectVertex instance.
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
        this.mousePosition = null;
    }

    /**
     * Updates the current mouse position.
     *
     * @param mouseX x-coord of the mouse
     * @param mouseY y-coord of the mouse
     */
    setMousePosition(mouseX: number, mouseY: number): void {
        this.mousePosition = new THREE.Vector2(mouseX, mouseY);
    }

    execute(): void {
        const graph = this.window.getGraph();

        if (graph !== null && this.mousePosition !== null) {
            const pointerOver = this.get_pointer_over(graph.getVertices(), this.mousePosition);

            if (pointerOver.length === 0) {
                this.window.setSelectedNode(null);
                this.window.updateColorNode(new THREE.Color());
                this.window.updateTextNode('');
                return;
            }

            const depthValues = pointerOver.map((v) => v.getDepth());
            const closest = Math.min(...depthValues);

            for (let i = 0; i < pointerOver.length; i++) {
                if (closest === depthValues[i]) {
                    pointerOver[i].setSelected(true);

                    this.window.setSelectedNode(pointerOver[i]);
                    this.window.updateColorNode(pointerOver[i].getColour());
                    this.window.updateTextNode(pointerOver[i].getText());
                }
            }

            this.window.refresh(true, false);
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private get_pointer_over(vertices: Vertex[], mousePos: THREE.Vector2): Vertex[] {
        const pointerOver = [];

        for (let i = 0; i < vertices.length; ++i) {
            if (vertices[i].isPointerOver(mousePos)) {
                pointerOver.push(vertices[i]);
            }

            vertices[i].setSelected(false);
            vertices[i].setVertexNumber(i);
        }

        return pointerOver;
    }
}