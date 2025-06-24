import * as THREE from 'three';
import type { JSX } from 'react';
import React from 'react';

import { Vertex } from "./Vertex";
import { Config } from '../Config';

/**
 * Graph :: Representation of a graph
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export abstract class Graph {

    // --------------------------------
    // Properties
    // --------------------------------

    protected vertices: Vertex[] = [];
    protected edgeList: number[][] = [];
    protected adjacencyMatrix: number[][] = [];

    /**
     * Constructor for Graph
     *
     * @param filePath path of the file
     */
    constructor(filePath?: string) {
        /* v8 ignore next 5 */
        if (!Config.testMode) {
            if (Config.scene == null || Config.camera == null || Config.renderer == null) {
                throw new Error('NullError :: THREE.js has not been initialised yet');
            }
        }

        if (filePath !== undefined) {
            this.read(filePath);
        }
    }

    /**
     * Draw the graph
     */
    /* v8 ignore next 5 */
    draw(): JSX.Element[] {
        return this.vertices.map((vertex, i) =>
            <React.Fragment key={i}>
                {vertex.draw()}
            </React.Fragment>
        );
    }

    /**
     * Update the graph
     */
    /* v8 ignore next 5 */
    update(): void {
        this.vertices.map((vertex) => {
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

        return input.trim().split(/\s+/).map(token => {
            const num = parseInt(token, 10);

            if (isNaN(num)) {
                throw new Error(
                    `InvalidToken: '${token}' is not a number`
                );
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
     * Compute bounding box of the graph
     */
    getBoundingBox(): THREE.Box3 {
        const box = new THREE.Box3();
        this.vertices.forEach(v => box.expandByPoint(v.getPos()));

        return box;
    }

    /**
     * Get the number of vertices
     *
     * @returns number of vertices
     */
    getNumVertices(): number {
        return this.vertices.length;
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
     * Get the number of edges
     *
     * @returns number of edges
     */
    getNumEdges(): number {
        return this.edgeList.length;
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
    getAdjacencyMatrix(): number[][] {
        return this.adjacencyMatrix;
    }
}