import * as fs from 'fs';

import { Graph } from "../Graph";
import { Vertex } from "../Vertex";

/**
 * EdgeGraph :: Representation of an edge graph
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class EdgeGraph extends Graph {
    /**
     * Constructor for EdgeGraph
     *
     * @param filePath path of the file
     * @param newEdgeList list of edges
     */
    constructor(filePath?: string, newEdgeList?: number[][]) {
        super();

        // Define Graph using the file
        if (filePath !== undefined && newEdgeList === undefined) {
            this.read(filePath);
        }

        // Define Graph using the edgeList
        else if (filePath === undefined && newEdgeList !== undefined) {
            if (!EdgeGraph.is_valid_edge_list(newEdgeList)) {
                throw new Error(
                    "InvalidEdge :: Edges can only have two linked vertices"
                );
            }

            this.edgeList = newEdgeList;
            this.init();
        }

        // It is not possible to define both attributes
        else {
            throw new Error('InvalidParams :: Cannot define both params');
        }
    }

    protected read(filePath: string): void {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split(/\r?\n/);

        // Prepare edges and find the number of vertices
        lines?.map((line: string) => {
            if (line.length > 1) {
                let tokens = Graph.split(line);

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

    // --------------------------------
    // Private
    // --------------------------------

    private init(): void {
        let numVertices = 0;

        // Prepare edges and find the number of vertices
        for (let i = 0; i < this.edgeList.length; ++i) {
            if (this.edgeList[i][0] > numVertices) {
                numVertices = this.edgeList[i][0];
            }

            if (this.edgeList[i][1] > numVertices) {
                numVertices = this.edgeList[i][1];
            }
        }

        // Increment numVertices to account
        // for zero-based indexing
        numVertices++;

        // Initialise the vertices and adjacency matrix
        for (let i = 0; i < numVertices; ++i) {
            this.vertices.push(new Vertex(0, 0, 0));
            this.adjacencyMatrix.push([]);

            for (let j = 0; j < numVertices; ++j) {
                this.adjacencyMatrix[i].push(0);
            }
        }

        // Prepare the vertices and adjacency matrix
        // based on the connections
        for (let k = 0; k < this.edgeList.length; ++k) {
            let k0 = this.edgeList[k][0];
            let k1 = this.edgeList[k][1];

            this.vertices[k0].attachPoint(this.vertices[k1]);

            this.vertices[k0].updateDegree();
            this.vertices[k1].updateDegree();

            this.adjacencyMatrix[k0][k1] = 1;
            this.adjacencyMatrix[k1][k0] = 1;
        }

        this.edgeList = [];

        // Update the edges based on the adjacency matrix
        for (let i = 0; i < numVertices; ++i) {
            for (let j = i; j < numVertices; ++j) {
                if (this.adjacencyMatrix[i][j] == 1) {
                    this.edgeList.push([i, j]);
                }
            }
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private static is_valid_edge_list(edge_links: number[][]) {
        for (let i = 0; i < edge_links.length; i++) {
            if (!this.is_valid_edge(edge_links[i])) {
                return false;
            }
        }

        return true;
    }

    private static is_valid_edge(tokens: number[]): boolean {
        return tokens.length === 2 && tokens[0] !== undefined && tokens[1] !== undefined;
    }
}