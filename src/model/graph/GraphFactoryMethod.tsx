import { Graph } from "../Graph";
import { AdjacencyGraph } from "./AdjacencyGraph";
import { EdgeGraph } from "./EdgeGraph";
import { MatrixMarketGraph } from "./MatrixMarketGraph";

/**
 * GraphFactoryMethod :: Factory method for graphs
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class GraphFactoryMethod {
    /**
     * Create an graph based on its type
     *
     * @param line line of the file
     * @param content content of the graph
     * @returns algorithm
     */
    static create(line: string, content: string): Graph {
        // Matrix Market Graph
        if (line.length >= 14 && line.substring(0, 14) === "%%MatrixMarket") {
            return new MatrixMarketGraph(content);
        }

        // Edge Graph
        else if (line.length <= 4) {
            return new EdgeGraph(content);
        }

        // Adjacency Graph
        else if (line.length > 0 && (line.substring(0, 1) === "0" || line.substring(0, 1) === "1")) {
            return new AdjacencyGraph(content);
        }

        // Unsupported graph
        else {
            throw new Error(
                "InvalidGraph :: Passed graph is not supported"
            );
        }
    }

    /**
     * Create a empty graph based on its type
     *
     * @param type type of the graph
     * @param content content of the graph
     * @returns instance of a graph
     */
    static createWithType(type: string): Graph {
        switch (type) {
            case 'AdjacencyGraph':
                return new AdjacencyGraph();
            case 'EdgeGraph':
                return new EdgeGraph();

            case 'MatrixMarketGraph':
                return new MatrixMarketGraph();

            default:
                throw new Error(
                    "InvalidGraph :: Passed graph is not supported"
                );
        }
    }
}