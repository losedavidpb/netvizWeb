import { Graph } from "../Graph";
import { Algorithm, AlgorithmType } from "../Algorithm";
import { FruchtermanReingold } from "./FruchtermanReingold";
import { MultiForce } from "./MultiForce";
import { SimpleForceDirected } from "./SimpleForceDirected";

/**
 * AlgorithmFactoryMethod :: Factory method for algorithms
 *
 * @author losedavidpb <losedavidpb@gmail.com>
 */
export class AlgorithmFactoryMethod {
    /**
     * Creates an algorithm based on its type.
     *
     * @param type type of the algorithm
     * @param graph graph to be used
     * @returns new instance of an algorithm
     */
    static create(type: AlgorithmType, graph: Graph): Algorithm {
        switch (type) {
            case AlgorithmType.FruchtermanReingold: {
                return new FruchtermanReingold(graph);
            }

            case AlgorithmType.MultiForce: {
                return new MultiForce(graph);
            }

            case AlgorithmType.SimpleForceDirected: {
                return new SimpleForceDirected(graph);
            }

            default:
                throw new Error(
                    "InvalidAlgorithm :: Passed algorithm is not supported"
                );
        }
    }
}