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
     * @param content content of the file
     */
    constructor(content?: string) {
        /* v8 ignore next 5 */
        if (!Config.testMode) {
            if (Config.scene == null || Config.camera == null || Config.renderer == null) {
                //throw new Error('NullError :: THREE.js has not been initialised yet');
            }
        }

        if (content !== undefined) {
            this.read(content);
        }
    }

    /**
     * Draw the graph
     */
    /* v8 ignore next 7 */
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
     * Get the string representation of the graph
     */
    abstract toString(): string;

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

    /**
     * Check whether the current and the passed graph are equal
     *
     * @param other graph to compare
     * @returns if graphs are equal
     */
    equals(other: unknown): boolean {
        if (!(other instanceof Graph)) return false;

        const matricesEqual = (a: number[][], b: number[][]): boolean => {
            if (a.length !== b.length) return false;

            return a.every((row, i) => {
                if (row.length !== b[i].length) return false;
                return row.every((val, j) => val === b[i][j]);
            });
        };

        const verticesEqual = (a: Vertex[], b: Vertex[]): boolean =>
            a.length === b.length && a.every((val, i) => val.equals(b[i]));


        return (
            verticesEqual(this.vertices, other.vertices) &&
            matricesEqual(this.adjacencyMatrix, other.adjacencyMatrix) &&
            matricesEqual(this.edgeList, other.edgeList)
        );
    }

    /**
     * Return a JSON representation of the graph
     *
     * @returns JSON object
     */
    toJSON(): object {
        return {
            type: this.constructor.name,
            vertices: this.vertices.map((v) => (v.toJSON())),
            edges: this.edgeList,
            adjacencyMatrix: this.adjacencyMatrix,
        };
    }

    /**
     * Create a graph based on its JSON object
     *
     * @param object JSON object
     * @returns graph
     */
    static async fromJSON(object: any): Promise<Graph> {
        const { GraphFactoryMethod } = await import('./graph/GraphFactoryMethod');
        const graph = GraphFactoryMethod.createWithType(object.type);

        graph.vertices = object.vertices.map((vObj: any) => Vertex.fromJSON(vObj));
        graph.edgeList = object.edges.map((e: any) => [e[0], e[1]]);
        graph.adjacencyMatrix = object.adjacencyMatrix;

        for (const vertex_obj of object.vertices) {
            const vertex = graph.vertices.find(
                (v) => v.getVertexNumber() === vertex_obj.vertexNumber
            );

            for (const point_obj of vertex_obj.attachedPoints) {
                const point = graph.vertices.find(
                    (v) => v.getVertexNumber() === point_obj
                );

                if (point !== undefined) {
                    vertex?.attachPoint(point);
                }
            }
        }

        return graph;
    }
}