import type { JSX } from 'react';
import React from 'react';
import * as THREE from 'three';

import { Vertex } from "./Vertex";

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
     * Creates a new Graph instance.
     *
     * @param content content of the graph
     */
    constructor(content?: string) {
        if (content !== undefined) {
            this.read(content);
        }
    }

    /**
     * Starts the rendering of the graph.
     *
     * @returns JSX element representing the graph
     */
    /* v8 ignore next 7 */
    draw(): JSX.Element[] {
        return this.vertices.map((vertex) =>
            <React.Fragment key={vertex.getVertexNumber()}>
                {vertex.draw()}
            </React.Fragment>
        );
    }

    /**
     * Updates the graph for rendering.
     */
    /* v8 ignore next 5 */
    update(): void {
        this.vertices.forEach(
            vertex => vertex.update()
        );
    }

    /**
     * Gets the string version of the graph.
     *
     * @returns string representation of the graph
     */
    abstract toString(): string;

    /**
     * Initialises the graph using the passed file.
     *
     * @param content content of the graph
     */
    protected abstract read(content: string): void;

    /**
     * Converts a string of vertices into an array of numbers.
     *
     * @param input string of vertices
     * @returns array of numbers
     */
    static split(input: string): number[] {
        const value = input.trim();
        if (value.length === 0) return [];

        return value.split(/\s+/).map(token => {
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
     * Defines the properties of a graph using the
     * references of the current one.
     *
     * @param other other graph
     */
    migrate(other: Graph): void {
        other.adjacencyMatrix = this.adjacencyMatrix;
        other.edgeList = this.edgeList;
        other.vertices = this.vertices;
    }

    /**
     * Computes the bounding box of the graph
     */
    getBoundingBox(): THREE.Box3 {
        const box = new THREE.Box3();
        this.vertices.forEach(v => box.expandByPoint(v.getPos()));

        return box;
    }

    /**
     * Gets the number of vertices of the graph.
     *
     * @returns number of vertices
     */
    getNumVertices(): number {
        return this.vertices.length;
    }

    /**
     * Gets the vertices of the graph.
     *
     * @returns vertices
     */
    getVertices(): Vertex[] {
        return this.vertices;
    }

    /**
     * Gets the number of edges of the graph.
     *
     * @returns number of edges
     */
    getNumEdges(): number {
        return this.edgeList.length;
    }

    /**
     * Gets the edges of the graph.
     *
     * @returns edges
     */
    getEdges(): number[][] {
        return this.edgeList;
    }

    /**
     * Gets the adjacency matrix of the graph.
     *
     * @returns adjacency matrix
     */
    getAdjacencyMatrix(): number[][] {
        return this.adjacencyMatrix;
    }

    /**
     * Gets the hashcode of the graph.
     *
     * @returns graph hashcode
     */
    hashCode(): number {
        const str = JSON.stringify({
            vertices: this.vertices.map(v => v.toJSON()),
            edges: this.edgeList,
            adjacencyMatrix: this.adjacencyMatrix
        });

        let hash = 5381;

        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash & hash;
        }

        return hash >>> 0;
    }

    /**
     * Checks whether the current and the passed graph are equal.
     *
     * @param other graph to be compared
     * @returns if graphs are equal
     */
    equals(other: unknown): boolean {
        if (!(other instanceof Graph)) return false;
        return this.hashCode() === other.hashCode();
    }

    /**
     * Serialises the graph into a JSON-compatible object.
     *
     * @returns JSON representation of the graph
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
     * Creates a graph instance from a JSON object.
     *
     * @param object JSON representation of the graph
     * @returns restored graph instance
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

            if (vertex !== undefined) {
                for (const point_obj of vertex_obj.attachedPoints) {
                    const point = graph.vertices.find(
                        (v) => v.getVertexNumber() === point_obj
                    );

                    if (point !== undefined) {
                        vertex.attachPoint(point);
                    }
                }
            }
        }

        return graph;
    }
}