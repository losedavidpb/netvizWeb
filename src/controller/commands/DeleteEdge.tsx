import * as THREE from 'three';

import type { GLWindow } from "../../gui/GLWindow";
import { EdgeGraph } from "../../model/graph/EdgeGraph";
import type { Vertex } from "../../model/Vertex";
import type { Command } from "../Command";

/**
 * DeleteEdge :: Command to delete the selected edge
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class DeleteEdge implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private readonly window: GLWindow;
    private selectedEdge: number;

    /**
     * Creates a new DeleteEdge instance.
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
        this.selectedEdge = -1;
    }

    /**
     * Updates the selected edge.
     *
     * @param selectedEdge selected edge
     */
    setSelectedEdge(selectedEdge: number): void {
        this.selectedEdge = selectedEdge;
    }

    execute(): void {
        if (this.selectedEdge !== -1) {
            const graph = this.window.getGraph();

            if (graph !== null && graph.getNumVertices() > 1) {
                const newEdges = graph.getEdges().filter((_, i) =>
                    i != this.selectedEdge
                );

                const tempGraph = graph;
                const oldVertices = tempGraph.getVertices();

                const newGraph = new EdgeGraph(undefined, newEdges);
                const newVertices = newGraph.getVertices();

                this.update_graph(oldVertices, newVertices);

                this.window.setGraph(newGraph);
                this.window.refresh(true, true);
            }
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private update_graph(old_v: Vertex[], new_v: Vertex[]): void {
        this.window.setSelectedNode(null);
        this.window.setSelectedEdgeIndex(-1);

        this.window.updateColorNode(new THREE.Color());
        this.window.updateTextNode('');
        this.window.updateTextEdge('');
        this.window.updateColorEdge(new THREE.Color());

        for (let i = 0; i < new_v.length; ++i) {
            const oldPos = old_v[i].getPos();
            const [r, g, b] = old_v[i].getColour();

            new_v[i].setPos({ x: oldPos.x, y: oldPos.y, z: oldPos.z });
            new_v[i].setText(old_v[i].getText());
            new_v[i].setColour(r, g, b);

            const new_edg = new_v[i].getEdges();
            const old_edg = old_v[i].getEdges();

            for (let k = 0; k < new_edg.length; k++) {
                new_edg[k].setText(old_edg[k].getText());
            }
        }
    }
}