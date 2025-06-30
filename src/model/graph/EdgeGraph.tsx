import { Graph } from "../Graph";
import { Vertex } from "../Vertex";

/**
 * EdgeGraph :: Graph based on the edge list
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class EdgeGraph extends Graph {
    /**
     * Creates a new EdgeGraph instance.
     *
     * @param content content of the file
     * @param newEdgeList list of edges
     */
    constructor(content?: string, newEdgeList?: number[][]) {
        super();

        // Defines Graph using the file
        if (content !== undefined && newEdgeList === undefined) {
            this.read(content);
        }

        // Defines Graph using the edgeList
        else if (content === undefined && newEdgeList !== undefined) {
            if (!EdgeGraph.is_valid_edge_list(newEdgeList)) {
                throw new Error(
                    "InvalidEdge :: Edges can only have two linked vertices"
                );
            }

            this.edgeList = newEdgeList;
            this.init();
        }

        // It is not possible to define both attributes
        else if (content !== undefined && newEdgeList !== undefined) {
            throw new Error(
                'InvalidParams :: Cannot define both params'
            );
        }
    }

    protected read(content: string): void {
        if (content !== '') {
            const lines = content.split(/\r?\n/);

            // Prepares edges and find the number of vertices
            lines.forEach((line: string) => {
                if (line.length > 1) {
                    const tokens = Graph.split(line);

                    if (!EdgeGraph.is_valid_edge(tokens)) {
                        throw new Error(
                            "InvalidEdge :: Edges can only have two linked vertices"
                        );
                    }

                    this.edgeList.push(tokens);
                }
            });

            this.init();
        }
    }

    toString(): string {
        return this.edgeList.map(([from, to]) => `${from} ${to}`).join('\n');
    }

    // --------------------------------
    // Private
    // --------------------------------

    private init(): void {
        let numVertices = 0;

        // Prepare edges and find the number of vertices
        for (const [base, connect] of this.edgeList) {
            if (base > numVertices) {
                numVertices = base;
            }

            if (connect > numVertices) {
                numVertices = connect;
            }
        }

        // Increments numVertices to account
        // for zero-based indexing
        numVertices++;

        // Initialises the vertices and adjacency matrix
        for (let i = 0; i < numVertices; ++i) {
            this.vertices.push(new Vertex(0, 0, 0));
            this.adjacencyMatrix.push([]);

            for (let j = 0; j < numVertices; ++j) {
                this.adjacencyMatrix[i].push(0);
            }
        }

        // Prepares the vertices and adjacency matrix
        // based on the connections
        for (const [k0, k1] of this.edgeList) {
            this.vertices[k0].attachPoint(this.vertices[k1]);
            this.vertices[k0].updateDegree();
            this.vertices[k1].updateDegree();

            this.adjacencyMatrix[k0][k1] = 1;
            this.adjacencyMatrix[k1][k0] = 1;
        }

        this.edgeList = [];

        // Updates the edges based on the adjacency matrix
        for (let i = 0; i < numVertices; ++i) {
            for (let j = i; j < numVertices; ++j) {
                if (this.adjacencyMatrix[i][j] === 1) {
                    this.edgeList.push([i, j]);
                }
            }
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private static is_valid_edge_list(edge_links: number[][]): boolean {
        return edge_links.every(edge => this.is_valid_edge(edge));
    }

    private static is_valid_edge(tokens: number[]): boolean {
        return tokens.length === 2 && tokens.every(token => typeof token === 'number');
    }
}