import * as THREE from 'three';

import type { Vertex } from "./Vertex";

/**
 * Graph :: Representation of a graph
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export abstract class Graph {

    // --------------------------------
    // Properties
    // --------------------------------

    // TODO: Shouldn't be located somewhere else?
    //
    // Flag to indicate whether the class is being tested or not
    static testMode: boolean;

    // Scene in which all objects are rendered
    static scene: THREE.Scene;

    // Camera used to view the scene
    static camera: THREE.Camera;

    // WebGL renderer used to draw the scene
    static renderer: THREE.WebGLRenderer;

    //private algorithm: Algorithm;

    protected vertices: Vertex[];
    protected edgeList: number[][];
    protected adjacencyMatrix: number[][];

    /**
     * Constructor for Graph
     *
     * @param filePath path of the file
     */
    constructor(filePath?: string) {
        if (!Graph.testMode) {
            if (Graph.scene == null || Graph.camera == null || Graph.renderer == null) {
                throw new Error('NullError :: THREE.js has not been initialised yet');
            }
        }

        this.vertices = [];
        this.edgeList = [];
        this.adjacencyMatrix = [];

        if (filePath !== undefined) {
            this.read(filePath);
        }
    }

    /**
     * Draw the graph
     */
    /* v8 ignore next 5 */
    draw(): void {
        this.vertices?.map((vertex) => {
            vertex.draw();
        });
    }

    /**
     * Update the graph
     */
    /* v8 ignore next 5 */
    update(): void {
        this.vertices?.map((vertex) => {
            vertex.update();
        });
    }

    /**
     * Prepare the graph using the passed file
     *
     * @param filePath path of the file with the graph
     */
    protected abstract read(filePath: string): void;

    /**
     * Convert a string of vertices into an array of integers
     *
     * @param input string of vertices
     */
    static split(input: string): number[] {
        if (input.trim().length === 0) return [];

        const tokens = input.trim().split(/\s+/);

        return tokens.map(token => {
            let num = parseInt(token, 10);

            if (isNaN(num)) {
                throw new Error(`InvalidToken: '${token}' is not a number`);
            }

            return num;
        });
    }

    /**
     * Hashcode of the graph
     *
     * @param h1 Current seconds
     * @param h2 Current microseconds
     * @param h3 PID of the process
     * @returns
     */
    static hash(h1: number, h2: number, h3: number): number {
        return ((h1 * 2654435789) + h2) * 2654435789 + h3;
    }

    /**
     * Get the vertices
     *
     * @returns vertices
     */
    getVertices(): Vertex[] {
        return this.vertices;
    }

    /**
     * Get the edges
     *
     * @returns edges
     */
    getEdges(): number[][] {
        return this.edgeList;
    }

    /**
     * Get the adjacency matrix
     *
     * @returns adjacency matrix
     */
    getAdjacencyMatrix() {
        return this.adjacencyMatrix;
    }
}