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
    static createGraph(line: string, content: string): Graph {
        // Edge Graph
        if (line.length <= 4) {
            return new EdgeGraph(content);
        }

        // Matrix Market Graph
        else if (line.substring(0, 14) === "%%MatrixMarket") {
            return new MatrixMarketGraph(content);
        }

        // Adjacency Graph
        else if (line.length > 3 && (line.substring(0, 1) === "0" || line.substring(0, 1) === "1")) {
            return new AdjacencyGraph(content);
        }

        else {
            throw new Error(
                "InvalidGraph :: Passed graph is not supported"
            );
        }
    }
}