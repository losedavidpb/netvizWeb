import { Graph } from "../Graph";
import { Vertex } from '../Vertex';

/**
 * AdjacencyGraph :: Graph based on the adjacency matrix
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class AdjacencyGraph extends Graph {

    protected read(content: string): void {
        if (content !== '') {
            const lines = content.split(/\r?\n/);
            let ncol = -1;

            // Prepares vertices and edges
            lines.forEach((line) => {
                if (line.length >= 1) {
                    const tokens = Graph.split(line);

                    // Check that the adjacency matrix is simetric
                    if (!(ncol === -1 || ncol === tokens.length)) {
                        throw new Error(
                            "InvalidAdjacencyMatrix :: Adjacency Matrix must be simetric"
                        );
                    }

                    if (!AdjacencyGraph.is_valid_adjacency_row(tokens)) {
                        throw new Error(
                            "InvalidAdjacencyMatrix :: Adjacency Matrix must have binary values"
                        );
                    }

                    this.edgeList.push(tokens);
                    this.vertices.push(new Vertex(0, 0, 0));

                    ncol = tokens.length;
                }
            });

            const nrow = this.vertices.length;

            // Checks that the adjacency matrix is simetric
            if (nrow !== ncol) {
                throw new Error(
                    "InvalidAdjacencyMatrix :: Adjacency Matrix must be simetric"
                );
            }

            this.update_adjacency_matrix();
            this.update_vertices();
            this.update_edges();
        }
    }

    toString(): string {
        if (this.vertices.length === 0) return '';
        return this.adjacencyMatrix.map(row => row.join(' ')).join('\n');
    }

    // --------------------------------
    // Private
    // --------------------------------

    private static is_valid_adjacency_row(tokens: number[]): boolean {
        return tokens.every(token => token === 0 || token === 1);
    }

    private update_adjacency_matrix(): void {
        for (let i = 0; i < this.vertices.length; ++i) {
            this.adjacencyMatrix.push([]);

            for (let j = 0; j < this.vertices.length; ++j) {
                this.adjacencyMatrix[i].push(this.edgeList[i][j]);
            }
        }
    }

    private update_vertices(): void {
        for (let i = 0; i < this.vertices.length; ++i) {
            for (let j = i; j < this.vertices.length; ++j) {
                if (this.adjacencyMatrix[i][j] === 1) {
                    // Vertices can't connect to themselves
                    if (j == i) continue;

                    this.vertices[i].attachPoint(this.vertices[j]);
                    this.vertices[i].updateDegree();
                    this.vertices[j].updateDegree();
                }
            }
        }
    }

    private update_edges(): void {
        this.edgeList = [];

        // Updates the edges based on the adjacency matrix
        for (let i = 0; i < this.vertices.length; ++i) {
            for (let j = 0; j < i; ++j) {
                if (this.adjacencyMatrix[i][j] === 1) {
                    this.edgeList.push([j, i]);
                }
            }
        }
    }
}