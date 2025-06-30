import * as THREE from 'three';

import type { GLWindow } from "../../gui/GLWindow";
import type { Vertex } from "../../model/Vertex";
import type { Command } from "../Command";

/**
 * SelectEdge :: Command to select an edge
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class SelectEdge implements Command {

    // --------------------------------
    // Properties
    // --------------------------------

    private readonly window: GLWindow;
    private mousePosition: THREE.Vector2 | null;

    /**
     * Creates a new SelectEdge instance.
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
            const vertices = graph.getVertices();

            const pointerOver = this.get_pointer_over(vertices, this.mousePosition);

            if (pointerOver.length === 0) {
                this.reset_selector();
                return;
            }

            const secondVertex = this.get_second_vertex(pointerOver);

            if (secondVertex === null) {
                this.reset_selector();
                return;
            }

            const selectedNode = this.window.getSelectedNode();

            if (selectedNode === null) {
                this.reset_selector();
                return;
            }

            const selectedVertexNumber = selectedNode.getVertexNumber();
            const edges = graph.getEdges();

            this.window.refresh(false, true);
            const edgeBetween = this.find_selected_edge(edges, selectedVertexNumber, secondVertex);

            if (edgeBetween) {
                const [firstVertex, secondVertex] = edges[this.window.getSelectedEdgeIndex()];

                if (!this.update_edge_details(vertices, firstVertex, secondVertex)) {
                    this.update_edge_details(vertices, secondVertex, firstVertex);
                }
            }

            this.window.refresh(true, false);
        }
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

    private find_selected_edge(edges: number[][], selectedVertexNumber: number, secondVertex: Vertex): boolean {
        let edgeBetween = false;

        for (let i = 0; i < edges.length; i++) {
            edgeBetween = this.is_edge_between(edges[i], selectedVertexNumber, secondVertex);

            if (edgeBetween) {
                this.window.setSelectedEdgeIndex(i);
                break;
            }
        }

        return edgeBetween;
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