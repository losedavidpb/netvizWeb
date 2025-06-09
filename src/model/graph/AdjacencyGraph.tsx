import * as fs from 'fs';

import { Graph } from "../Graph";
import { Vertex } from '../Vertex';

/**
 * AdjacencyGraph :: Representation of an adjacency graph
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class AdjacencyGraph extends Graph {
    protected read(filePath: string): void {
        const content = fs.readFileSync(filePath, 'utf-8');

        if (content !== '') {
            const lines = content.split(/\r?\n/);
            let [nrow, ncol] = [-1, -1];

            // Prepare vertices and edges
            lines?.map((line) => {
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

            nrow = this.vertices.length;

            // Check that the adjacency matrix is simetric
            if (nrow !== ncol) {
                throw new Error(
                    "InvalidAdjacencyMatrix :: Adjacency Matrix must be simetric"
                );
            }

            // Prepare the adjacency matrix
            for (let i = 0; i < this.vertices.length; ++i) {
                this.adjacencyMatrix.push([]);

                for (let j = 0; j < this.vertices.length; ++j) {
                    this.adjacencyMatrix[i].push(this.edgeList[i][j]);
                }
            }

            // Update the vertices based on the adjacency matrix
            for (let i = 0; i < this.vertices.length; ++i) {
                for (let j = i; j < this.vertices.length; ++j) {
                    //if (j == i) continue; // Vertices don't connect to themselves

                    if (this.adjacencyMatrix[i][j] == 1) {
                        // Vertices can't connect to themselves
                        if (j == i) continue;

                        this.vertices[i].attachPoint(this.vertices[j]);

                        this.vertices[i].updateDegree();
                        this.vertices[j].updateDegree();
                    }
                }
            }

            this.edgeList = [];

            // Update the edges based on the adjacency matrix
            for (let i = 0; i < this.vertices.length; ++i) {
                for (let j = 0; j < i; ++j) {
                    if (this.adjacencyMatrix[i][j] == 1) {
                        this.edgeList.push([j, i]);
                    }
                }
            }
        }
    }

    // --------------------------------
    // Private
    // --------------------------------

    private static is_valid_adjacency_row(tokens: number[]): boolean {
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== 0 && tokens[i] !== 1) {
                return false;
            }
        }

        return true;
    }
}