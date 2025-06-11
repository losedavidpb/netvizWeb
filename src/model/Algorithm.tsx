import type { Graph } from "./Graph";

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
     * Constructor for Algorithm
     *
     * @param graph graph to be used
     */
    constructor(graph: Graph) {
        this.graph = graph;
    }

    /**
     * Executes the algorithm to the graph
     */
    abstract apply(): void;

    /**
     * Randomly places the vertices in the layout area
     */
    abstract place(): void;
}