import { Graph } from "../Graph";
import { Algorithm, AlgorithmType } from "../Algorithm";

/**
 * AlgorithmFactoryMethod :: Factory method for algorithms
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class AlgorithmFactoryMethod {
    /**
     * Create an algorithm based on its type
     *
     * @param type algorithm type
     * @param graph graph to be used
     * @returns algorithm
     */
    static async createAlgorithm(type: AlgorithmType, graph: Graph): Promise<Algorithm> {
        switch (type) {
            case AlgorithmType.FruchtermanReingold:
                const { FruchtermanReingold } = await import("./FruchtermanReingold");
                return new FruchtermanReingold(graph);

            case AlgorithmType.MultiForce:
                const { MultiForce } = await import("./MultiForce");
                return new MultiForce(graph);

            case AlgorithmType.SimpleForceDirected:
                const { SimpleForceDirected } = await import("./SimpleForceDirected");
                return new SimpleForceDirected(graph);

            default:
                throw new Error(
                    "InvalidAlgorithm :: Passed algorithm is not supported"
                );
        }
    }
}