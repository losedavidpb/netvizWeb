import type { Graph } from "./Graph";

/**
 * Available algorithm types
 */
export const AlgorithmType = {
    FruchtermanReingold: "FruchtermanReingold",
    SimpleForceDirected: "SimpleForceDirected",
    MultiForce: "MultiForce"
} as const;

// Derive a union type from the values
export type AlgorithmType = typeof AlgorithmType[keyof typeof AlgorithmType];

/**
 * Algorithm :: Representation of an algorithm
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export abstract class Algorithm {

    // --------------------------------
    // Properties
    // --------------------------------

    protected graph: Graph;

    /**
     * Creates a new Algorithm instance.
     *
     * @param graph graph to be used
     */
    constructor(graph: Graph) {
        this.graph = graph;
    }

    /**
     * Gets the graph of the algorithm.
     *
     * @returns graph of the algorithm
     */
    /* v8 ignore next 3 */
    getGraph(): Graph {
        return this.graph;
    }

    /**
     * Applies the algorithm to the graph.
     */
    abstract apply(): void;

    /**
     * Randomly places the vertices in the layout area.
     */
    abstract place(): void;
}