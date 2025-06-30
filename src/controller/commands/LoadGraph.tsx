import * as THREE from 'three';

import type { GLWindow } from "../../gui/GLWindow";
import type { Command } from "../Command";

/**
 * LoadGraph :: Command to load graphs
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class LoadGraph implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private readonly window: GLWindow;

    /**
     * Creates a new LoadGraph instance.
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
    }

    execute(): void {
        (async () => {
            const content = this.window.getContent();

            if (content !== '') {
                const lines = content.split(/\r?\n/);
                const line = lines[0];

                this.reset_selector();

                const { GraphFactoryMethod } = await import('../../model/graph/GraphFactoryMethod');
                const graph = GraphFactoryMethod.create(line, content);

                this.window.setGraph(graph);
                this.window.refresh(true, true);
            }
        })();
    }

    // --------------------------------
    // Private
    // --------------------------------

    private reset_selector(): void {
        this.window.setSelectedNode(null);
        this.window.updateColorNode(new THREE.Color());
        this.window.updateTextNode('');
        this.window.updateTextEdge('');
        this.window.updateColorEdge(new THREE.Color());
    }
}