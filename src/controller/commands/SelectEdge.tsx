import * as THREE from 'three';

import type { GLWindow } from "../../gui/GLWindow";
import type { Vertex } from "../../model/Vertex";
import type { Command } from "../Command";

/**
 * SelectEdge :: Command to select an edge
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
// TODO: Fix it cos it's not working
export class SelectEdge implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private window: GLWindow;
    private mousePosition: THREE.Vector2 | null;

    /**
     * Constructor for SelectEdge
     *
     * @param window parent window
     */
    constructor(window: GLWindow) {
        this.window = window;
        this.mousePosition = null;
    }

    /**
     * Set the current mouse position
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
            const vertices = graph.getVertices();

            const pointerOver = this.get_pointer_over(vertices, this.mousePosition);
            if (pointerOver.length === 0) return;

            const secondVertex = this.get_second_vertex(pointerOver);
            if (secondVertex === null) return;

            const selectedNode = this.window.getSelectedNode();
            if (selectedNode === null) return;

            const selectedVertexNumber = selectedNode.getVertexNumber();
            const edges = graph.getEdges();

            this.window.refresh(false, true);
            let edgeBetween = false;

            for (let i = 0; i < graph.getNumEdges(); i++) {
                edgeBetween = this.is_edge_between(edges[i], selectedVertexNumber, secondVertex);

                if (edgeBetween) {
                    this.window.setSelectedEdgeIndex(i);
                    //secondVertex.setSelected(true);
                    break;
                }
            }

            if (edgeBetween) {
                const [u, v] = edges[this.window.getSelectedEdgeIndex()];

                if (!this.update_edge_details(vertices, u, v)) {
                    this.update_edge_details(vertices, v, u);
                }
            }

            this.window.refresh(false, false);
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

    private get_second_vertex(pointerOver: Vertex[]): Vertex {
        let closest = pointerOver[0];
        let minDepth = closest.getDepth();

        for (let i = 1; i < pointerOver.length; i++) {
            const depth = pointerOver[i].getDepth();

            if (depth < minDepth) {
                minDepth = depth;
                closest = pointerOver[i];
            }
        }

        return closest;
    }

    private is_edge_between(edge: number[], vertex_number: number, second_vertex: Vertex): boolean {
        return (
            (
                edge[0] === vertex_number &&
                edge[1] === second_vertex.getVertexNumber()
            ) || (
                edge[1] === vertex_number &&
                edge[0] === second_vertex.getVertexNumber()
            )
        );
    }

    private update_edge_details(vertices: Vertex[], v: number, u: number): boolean {
        const attachedPoints_v = vertices[v].getAttachedPoints();

        for (let i = 0; i < attachedPoints_v.length; ++i) {
            if (attachedPoints_v[i].getVertexNumber() === u) {
                this.window.updateTextEdge(vertices[v].getEdges()[i].getText());
                this.window.updateColorEdge(vertices[v].getEdges()[i].getColour());
                return true;
            }
        }

        return false;
    }
}