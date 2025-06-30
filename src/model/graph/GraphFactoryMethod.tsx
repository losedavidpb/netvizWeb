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
     * Creates a graph based on the provided content and initial line.
     *
     * @param line first line of the graph file, used to identify the graph format
     * @param content full content of the graph file
     * @returns instance of the corresponding Graph subclass
     */
    static create(line: string, content: string): Graph {
        // Matrix Market Graph
        if (line.length >= 14 && line.startsWith("%%MatrixMarket")) {
            return new MatrixMarketGraph(content);
        }

        // Edge Graph
        else if (line.length <= 4) {
            return new EdgeGraph(content);
        }

        // Adjacency Graph
        else if (line.length > 0 && (line.startsWith("0") || line.startsWith("1"))) {
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
     * Creates an empty graph based on its type.
     *
     * @param type type of the graph
     * @param content content of the graph
     * @returns instance of a graph
     */
    static createWithType(type: string): Graph {
        switch (type) {
            case 'AdjacencyGraph': {
                return new AdjacencyGraph();
            }

            case 'EdgeGraph': {
                return new EdgeGraph();
            }

            case 'MatrixMarketGraph': {
                return new MatrixMarketGraph();
            }

            default:
                throw new Error(
                    "InvalidGraph :: Passed graph is not supported"
                );
        }
    }
}