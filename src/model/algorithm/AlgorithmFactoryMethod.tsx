import { Graph } from "../Graph";
import { FruchtermanReingold } from "./FruchtermanReingold";
import { MultiForce } from "./MultiForce";
import { SimpleForceDirected } from "./SimpleForceDirected";
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
    static createAlgorithm(type: AlgorithmType, graph: Graph): Algorithm {
        switch (type) {
            case AlgorithmType.FruchtermanReingold:
                return new FruchtermanReingold(graph);

            case AlgorithmType.MultiForce:
                return new MultiForce(graph);

            case AlgorithmType.SimpleForceDirected:
                return new SimpleForceDirected(graph);

            default:
                throw new Error(
                    "InvalidAlgorithm :: Passed algorithm is not supported"
                );
        }
    }
}