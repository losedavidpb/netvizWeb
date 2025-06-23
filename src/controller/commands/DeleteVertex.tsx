import * as THREE from 'three';

import { GLWindow } from "../../gui/GLWindow";
import { EdgeGraph } from "../../model/graph/EdgeGraph";
import type { Vertex } from "../../model/Vertex";
import type { Command } from "../Command";

/**
 * DeleteVertex :: Command to delete the selected vertex
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class DeleteVertex implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private window: GLWindow;
    private selectedNode: Vertex | null;

    /**
     * Constructor for DeleteVertex
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
        this.selectedNode = null;
    }

    /**
     * Set the selected node to be deleted
     *
     * @param selectedNode selected node
     */
    setSelectedNode(selectedNode: Vertex | null): void {
        this.selectedNode = selectedNode;
    }

    execute(): void {
        if (this.selectedNode !== null) {
            const deleteNode = this.selectedNode.getVertexNumber();
            const graph = this.window.getGraph();

            if (graph !== undefined) {
                const newEdges = graph.getEdges().filter(edge =>
                    edge[0] !== deleteNode && edge[1] !== deleteNode
                );

                for (let i = 0; i < newEdges.length; ++i) {
                    if (newEdges[i][0] > deleteNode) newEdges[i][0]--;
                    if (newEdges[i][1] > deleteNode) newEdges[i][1]--;
                }

                const tempGraph = graph;
                const oldVertices = tempGraph.getVertices();

                const newGraph = new EdgeGraph(undefined, newEdges);
                const newVertices = newGraph.getVertices();

                const f = (i: number) => (i < deleteNode ? i : i + 1);
                this.update_graph(oldVertices, newVertices, f);

                this.window.setGraph(newGraph);
                this.window.refresh();
            }
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private update_graph(old_v: Vertex[], new_v: Vertex[], f: (i: number) => number): void {
        this.window.setSelectedNode(null);
        this.window.updateColorNode(new THREE.Color());
        this.window.updateTextNode('');

        for (let i = 0; i < new_v.length; ++i) {
            const oldPos = old_v[f(i)].getPos();
            const [r, g, b] = old_v[f(i)].getColour();

            new_v[i].setPos({ x: oldPos.x, y: oldPos.y, z: oldPos.z });
            new_v[i].setText(old_v[f(i)].getText());
            new_v[i].setColour(r, g, b);
            new_v[i].setSelected(false);
        }
    }
}