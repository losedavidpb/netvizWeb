import * as THREE from 'three';

import { GLWindow } from "../../gui/GLWindow";
import { EdgeGraph } from "../../model/graph/EdgeGraph";
import { Vertex } from "../../model/Vertex";
import type { Command } from "../Command";
import type { Graph } from '../../model/Graph';

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

            if (graph !== null && graph.getNumVertices() > 1) {
                const newEdges = graph.getEdges().filter(edge =>
                    edge[0] !== deleteNode && edge[1] !== deleteNode
                );

                for (let i = 0; i < newEdges.length; ++i) {
                    if (newEdges[i][0] > deleteNode) newEdges[i][0]--;
                    if (newEdges[i][1] > deleteNode) newEdges[i][1]--;
                }

                const tempGraph = graph;
                const newGraph = new EdgeGraph(undefined, newEdges);

                const f = (i: number) => (i < deleteNode ? i : i + 1);
                this.update_graph(tempGraph, newGraph, f);

                this.window.setGraph(newGraph);
                this.window.refresh();
            }
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private update_graph(oldGraph: Graph, newGraph: Graph, f: (i: number) => number): void {
        const old_v = oldGraph.getVertices();
        const new_v = newGraph.getVertices();
        const selectedVertex = this.selectedNode as Vertex;

        this.window.setSelectedNode(null);
        this.window.setSelectedEdgeIndex(-1);

        this.window.updateColorNode(new THREE.Color());
        this.window.updateTextNode('');
        this.window.updateTextEdge('');
        this.window.updateColorEdge(new THREE.Color());

        for (let i = 0; i < new_v.length; i++) {
            const oldPos = old_v[f(i)].getPos();
            const [r, g, b] = old_v[f(i)].getColour();

            new_v[i].setPos({ x: oldPos.x, y: oldPos.y, z: oldPos.z });
            new_v[i].setText(old_v[f(i)].getText());
            new_v[i].setColour(r, g, b);
            new_v[i].detachPoint(selectedVertex);
            new_v[i].setSelected(false);

            const old_edg = old_v[f(i)].getEdges();
            const new_edg = new_v[i].getEdges();

            for (let k = 0; k < new_edg.length; k++) {
                new_edg[k].setText(old_edg[k].getText());
            }
        }
    }
}